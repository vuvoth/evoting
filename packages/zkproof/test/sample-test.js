const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');
// const 
describe("verify", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Verify = await ethers.getContractFactory("Verifier");
    const verify = await Verify.deploy();
    await verify.deployed();
    let proof = fs.readFileSync("../circom/call.json");
    verify.verifyProof();
    // wait until the transaction is mined

  });
});
