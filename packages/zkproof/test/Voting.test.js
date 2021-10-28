const { expect } = require("chai");
const { ethers } = require("hardhat");
const OffChainManager = require('../src/OffChainManager');
const snarkjs = require('snarkjs');
const Web3Utils = require("web3-utils");
const BN = Web3Utils.BN;

const { mimcsponge } = require('circomlibjs');

describe("Voting", function () {
  const zkeyPath = "./circom/merkle_final.zkey";
  const merkleTreeWasmPath = "./circom/merkleTree.wasm";

  let voting;
  let mTree, tickets, root;
  let sessionId;

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

    sessionId = 0;
  })

  describe("Voting and count", () => {
    it("verify vote sucessfully", async function () {
      const secretInput = OffChainManager.createMerkleProof(tickets[0], mTree);

      expect(secretInput.exist).equal(true);

      let { proof, publicSignals } = await snarkjs.groth16.fullProve(secretInput.data, merkleTreeWasmPath, zkeyPath);

      let zkPoints = OffChainManager.solidityZKPoints(proof);
      await voting.vote(sessionId, publicSignals[1], 1, ...zkPoints);
    });
  })


});
