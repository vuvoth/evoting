const { expect } = require("chai");
const { ethers } = require("hardhat");
const OffChainManager = require('../src/OffChainManager');
const snarkjs = require('snarkjs');

describe("Voting", function () {
  let voting;
  let mTree, tickets, root;

  const zkeyPath = "./circom/merkle_final.zkey";
  const merkleTreeWasmPath = "./circom/merkleTree.wasm";

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

  })
  describe("Voting and count", () => {
    it("verify vote sucessfully", async function () {
      const secretInput = OffChainManager.createMerkleProof(tickets[0], mTree);

      expect(secretInput.exist).equal(true);
      if (secretInput.exist) {
        let {proof, publicSignals} = await snarkjs.groth16.fullProve(secretInput.data, merkleTreeWasmPath, zkeyPath);
      }
    });
  })


});
