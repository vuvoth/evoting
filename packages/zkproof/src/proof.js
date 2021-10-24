const snarkjs = require('snarkjs');
const wc = require("../circom/merkleTree_js/witness_calculator");
const { readFileSync, writeFileSync } = require("fs");


async function calculateWitness(input) {
    const buffer = readFileSync("./circom/merkleTree_js/merkleTree.wasm");

    let witnessCalculator = await wc(buffer);
    //    const w= await witnessCalculator.calculateWitness(input,0);
    //    for (let i=0; i< w.length; i++){
    //	console.log(w[i]);
    //    }
    const buff = await witnessCalculator.calculateWTNSBin(input, 0);
    writeFileSync("./circom/witness.wtns", buff);
}

let secret = {
    ticket: '335499083604320209633545586521014302808933324260814122444162011037',
    order: ['1', '1'],
    merkleProof: [
        '11036171389782024142419380912686791194402508760927834921517881244545286268054',
        '6869033472240180546174836934563914719518105041533477758834636380096053669596'
    ]
}


async function prove() {
    await calculateWitness(secret);
    let ans = await snarkjs.groth16.prove("./circom/merkle_final.zkey", "./circom/witness.wtns");
    return ans;
}

module.exports = {
    prove
}