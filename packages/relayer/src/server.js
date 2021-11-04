require('dotenv').config();

const { writeFile, readFile } = require('fs');
const express = require('express')
const app = express()
app.use(express.json());

const config = require('./config');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.header("access-control-allow-origin", "*");
    next();
})

app.get("/", async (req, res) => {
    res.send({
        "info": "V-Relayer server!!!",
        "relayerAddress": config.wallet.address,
        "relayerBalance": (await config.wallet.getBalance()).toString(),
        "relayerContract": process.env.CONTRACT_ADDR,
    })
})

// store merkle tree
app.post("/zkproof/:sessionId", async (req, res) => {
    const { mTree } = req.body;
    const { sessionId } = req.params;
    writeFile(__dirname + `/data/${process.env.CONTRACT_ADDR}_${sessionId}.json`, JSON.stringify({ mTree }, null, 2), (err) => {
        if (!err) {
            res.send({ success: true });
        } else {
            console.log(err);
            res.send({ error: err });
        }
    });
})

// fetch merket tree
app.get("/zkproof/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    readFile(__dirname + `/data/${process.env.CONTRACT_ADDR}_${sessionId}`, (err, data) => {
        if (!err) {
            res.send(JSON.parse(data));
        } else {
            res.send({ error: err })
        }
    })
})

app.get("/session/:sessionId", async (req, res) => {
    let sessionId = req.params['sessionId'];

    try {
        let query = await config.contract.reportAll(sessionId);

        const candidates = query.candidates.split(";");
        const voteResults = query.numberVotes.map(v => v.toString());

        let result = []

        voteResults.forEach((vote, index) => {
            result.push({ candidate: candidates[index], vote });
        });

        res.send({
            "question": query.question,
            result
        })
    } catch (err) {
        res.status(400);
        res.send({ error: err })
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
            gasUsed: receipt.gasUsed.toString()
        })
    } catch (err) {
        res.send({ err });
    }
})


module.exports = app;