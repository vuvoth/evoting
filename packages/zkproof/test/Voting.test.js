require("./setup");

const { expect } = require("chai");
const { ethers } = require("hardhat");
const OffChainManager = require("@evoting/offchain");
const snarkjs = require('snarkjs');

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

  it("Check parammeters", async () => {
    // check counter 
    let report = await voting.reportAll(sessionId);
    for (let c of report.numberVotes) {
      expect(c).to.equal(0);
    }
    // check root 
    expect(await voting.rootOf(sessionId)).to.equal(root);
  })

  describe("Voting and count", () => {
    it("verify vote sucessfully", async function () {
      const candidate = "0";
      const secretInput = OffChainManager.createMerkleProof(tickets[0], mTree);

      expect(secretInput.exist).equal(true);

      secretInput.data["candidate"] = candidate;

      let { proof, publicSignals } = await snarkjs.groth16.fullProve(secretInput.data, merkleTreeWasmPath, zkeyPath);

      let zkPoints = OffChainManager.solidityZKPoints(proof);

      let tx = await voting.vote(sessionId, publicSignals[1], publicSignals[2], candidate, ...zkPoints).should.be.fulfilled;

      await tx.wait();

      let result = await voting.reportAll(sessionId);

      expect(result.numberVotes[0]).to.equal(1);
      expect(result.numberVotes[1]).to.equal(0);
      expect(await voting.isVoted(sessionId, publicSignals[1])).to.equal(true);
    });
  })

});
