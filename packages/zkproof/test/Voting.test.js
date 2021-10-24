const { expect } = require("chai");
const { ethers } = require("hardhat");
const OffChainManager = require('../src/OffChainManager');
const snarkjs = require('snarkjs');
const {prove} = require('../src/proof');

const {readFileSync} = require('fs');

function p256(n) {
  let nstr = n.toString(16);
  while (nstr.length < 64) nstr = "0"+nstr;
  nstr = `"0x${nstr}"`;
  return nstr;
}

// const 
describe("Voting", function () {
  let voting;
  let mTree, tickets, root;
  let wasm, zkey;

  beforeEach(async () => {
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    // wait until the transaction is mined
    await voting.deployed();

    let sessionOffChain = OffChainManager.createVoteSession(4);
    mTree = sessionOffChain.mTree;
    tickets = sessionOffChain.tickets;
    root = sessionOffChain.root;
    await voting.createVoteSession(root);
    // zkey = readFileSync('./circom/merkle_final.zkey', 'utf8');
    // wasm = readFileSync('./circom/merkleTree_js/merkleTree.wasm', 'utf8');

  })
  describe("Voting and count", () => {
    it("voting", async function () {
      let secret = OffChainManager.createMerkleProof(tickets[0].toString(), mTree);
      let ans = await prove();      
      console.log(ans);
    });
  })



});
