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

app.get("/relay/:sessionId", async(req, res) => {

})

app.post("/relay/:sessionId/", async (req, res) => {
    let sessionId = req.params['sessionId'];
    let { voteCode, candidate, proof } = req.body;
    try {
        let tx = await config.contract.vote(sessionId, voteCode, candidate, ...proof);
        let receipt = await tx.wait();
        res.send({
            txHash: receipt.hash
        })
    } catch (err) {
        res.send({ err });
    }
})


module.exports = app;