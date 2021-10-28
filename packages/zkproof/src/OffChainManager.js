const merkleTree = require('./merkleTree');
const Web3Utils = require("web3-utils");
const BN = Web3Utils.BN;
const { mimcsponge } = require('circomlibjs')

function createVoteSession(numberVoter, seed = "this is the seed") {
    // init tickets
    let tickets = [];
    for (let i = 0; i < numberVoter; ++i) {
        tickets.push(new BN(Web3Utils.sha3(seed + i)).toString());
    }

    let mTree = merkleTree.initTicketBlocks(tickets);

    merkleTree.initMerkleTree(0, mTree);

    return {
        root: mTree[0].toString(),
        mTree,
        tickets
    };
}

function createMerkleProof(ticket, mTree) {
    const equalHash = (h) => h.toString() == mimcsponge.multiHash(ticket).toString();
    let blockId = mTree.findIndex(h => equalHash(h));

    let order = [];
    let merkleProof = [];

    if (blockId == -1) {
        return {
            exist: false,
            ticket,
            order,
            merkleProof
        }
    }
    const isRoot = (r) => r == 0;

    while (!isRoot(blockId)) {
        if (blockId % 2 == 0) {
            order.push(0);
            merkleProof.push(mTree[blockId - 1].toString());
        } else {
            order.push(1);
            merkleProof.push(mTree[blockId + 1].toString());
        }
        blockId = Math.floor((blockId - 1) / 2);
    }

    return {
        exist: true,
        data: {
            ticket,
            order,
            merkleProof
        }
    }
}

module.exports = {
    createVoteSession,
    createMerkleProof
}