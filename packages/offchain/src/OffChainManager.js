const merkleTree = require('./merkleTree');
const Web3Utils = require("web3-utils");
const BN = Web3Utils.BN;
const { mimcsponge } = require('circomlibjs')
// const snarkjs = require("snarkjs");

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
    const equalHash = (h) => h.toString() === mimcsponge.multiHash([ticket]).toString();
    let blockId = mTree.findIndex(h => equalHash(h));

    let order = [];
    let merkleProof = [];

    if (blockId == -1) {
        return {
            exist: false,
            data: {
                ticket,
                order,
                merkleProof
            }
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

function p256(n) {
    let nstr = n.toString(16);
    while (nstr.length < 64) nstr = "0" + nstr;
    nstr = `${nstr}`;
    return nstr;
}

function solidityZKPoints(proof) {
    let solidityParams = [
        [p256(proof.pi_a[0]), p256(proof.pi_a[1])],
        [
            [p256(proof.pi_b[0][1]), p256(proof.pi_b[0][0])],
            [p256(proof.pi_b[1][1]), p256(proof.pi_b[1][0])]
        ],
        [p256(proof.pi_c[0]), p256(proof.pi_c[1])]
    ]
    return solidityParams;
}

function toBNs(arr = []) {
    return arr.map(v => new BN(v));
}

function formatProof(candidate, proof, publicSignals) {
    let zkPoints = solidityZKPoints(proof);

    return [publicSignals[1], publicSignals[2], candidate, ...zkPoints]
}

module.exports = {
    createVoteSession,
    createMerkleProof,
    solidityZKPoints,
    toBNs,
    formatProof
}