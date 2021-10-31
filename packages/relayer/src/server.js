require('dotenv').config();
const express = require('express')
const app = express()
app.use(express.json());

const config = require('./config');

app.get("/", async (req, res) => {
    res.send({
        "info": "V-Relayer server!!!",
        "relayerAddress": config.wallet.address,
        "relayerBalance": (await config.wallet.getBalance()).toString(),
        "relayerContract": process.env.CONTRACT_ADDR,
    })
})

app.get("/session/:sessionId", async (req, res) => {
    let sessionId = req.params['sessionId'];

    try {
        res.send({
            voteCount: await config.contract.reportAll(sessionId)
        })
    } catch (err) {
        res.send({ err: err.message })
    }
})

app.post("/relay/:sessionId/", async (req, res) => {
    const { sessionId } = req.params;
    const { voteCode, candidateCode, candidate, proof } = req.body;
    try {
        const gasEstimate = await config.contract.estimateGas.vote(
            sessionId, voteCode, candidateCode, candidate, ...proof
        );

        const tx = await config.contract.vote(
            sessionId, voteCode, candidateCode, candidate, ...proof,
            { gasLimit: gasEstimate }
        );

        const receipt = await tx.wait();
        res.send({
            blockHash: receipt.blockHash,
            txHash: receipt.transactionHash,
            gasUsed: receipt.gasUsed
        })
    } catch (err) {
        res.send({ err });
    }
})


module.exports = app;