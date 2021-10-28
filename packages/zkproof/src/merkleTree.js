const { mimcsponge } = require('circomlibjs')

const Scalar = require("ffjavascript").Scalar
const Web3Utils = require("web3-utils");
const ZqField = require("ffjavascript").ZqField;
const F = new ZqField(Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617"));

const BN = Web3Utils.BN;

const DEFAULT_KEY = 0;
const ZERO = new BN(0);

function computeHash(leftHash, rightHash) {
    return mimcsponge.multiHash([leftHash, rightHash], DEFAULT_KEY);
}

function initTicketBlocks(tickets = []) {
    // |blocks| = 2^k 
    const blockSize = tickets.length;
    return new Array(blockSize - 1).fill(new BN(0)).concat(tickets.map(ticket => new BN(mimcsponge.multiHash([ticket]))));
}

function initMerkleTree(currentId, mTree) {
    if (mTree[currentId].gt(ZERO))
        return mTree[currentId];
    else {
        let leftHash = initMerkleTree(currentId * 2 + 1, mTree);
        let rightHash = initMerkleTree(currentId * 2 + 2, mTree);
        mTree[currentId] = new BN(F.normalize(computeHash(F.normalize(leftHash), F.normalize(rightHash))));
        return mTree[currentId];
    }
}

module.exports = {
    initTicketBlocks,
    initMerkleTree
}