require('dotenv').config();

const { ethers } = require('ethers');
const abi = require('./abi/abi');

const { RPC_URL, RELAYER_PRIVATE, CONTRACT_ADDR } = process.env;


const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(RELAYER_PRIVATE, provider);

const contract = new ethers.Contract(CONTRACT_ADDR, abi, wallet);
module.exports = {
    wallet,
    contract
}