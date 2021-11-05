const { ethers } = require('hardhat');

const BN = ethers.BigNumber.from;

require('chai')
    .use(require('chai-as-promised'))

require('chai/register-should')

module.exports = { BN }