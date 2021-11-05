import { createStore } from "vuex";
// import dotenv from "dotenv";

import { ethers } from "ethers";

const ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_root",
        type: "uint256",
      },
    ],
    name: "createVoteSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const CONTRACT = "0x3226a5B9371DdcC1aD1c75018776F6B985E95014";

export default createStore({
  state: {
    voteSessions: [],
    signer: Object,
    provider: Object,
    contract: Object,
    isConnected: false,
    currentAccount: "",
    balance: "0",
  },

  mutations: {
    CONNECT_PROVIDER(state) {
      if (window.ethereum && !state.isConnected) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        state.provider = provider;
        state.signer = provider.getSigner();
        try {
          state.contract = new ethers.Contract(
            CONTRACT,
            ABI,
            provider.getSigner()
          );
        } catch (err) {
          console.log(err);
        }
        state.isConnected = true;
      }
    },

    GET_SIGNER_ACCOUNT(state, accounts) {
      state.currentAccount = accounts[0];
    },

    DISCONNECT_PROVIDER(state) {
      if (state.isConnected) {
        state.provider.close();
      }
    },
    CHANGE_ACCOUNT(state, account) {
      state.currentAccount = account;
    },
    SET_BALANCE(state, balance) {
      state.balance = balance;
    },
  },

  actions: {
    connectToMetamask(context) {
      context.commit("CONNECT_PROVIDER");

      this.state.provider
        .send("eth_requestAccounts", [])
        .then(async (accounts) => {
          context.commit("GET_SIGNER_ACCOUNT", accounts);
          this.state.provider
            .getBalance(this.state.currentAccount)
            .then((balance) => {
              console.log(balance);
              context.commit("SET_BALANCE", balance);
            });
        });
    },

    disconnectFromMetaMask(context) {
      context.commit("DISCONNECT_PROVIDER");
    },

    changeAccounts(context, accounts) {
      context.commit("GET_SIGNER_ACCOUNT", accounts);
      this.state.provider
        .getBalance(this.state.currentAccount)
        .then((balance) => {
          console.log(balance);
          context.commit("SET_BALANCE", balance);
        });
    },
  },
  getters: {
    getSigner(state) {
      return state.signer;
    },
    getCurrentAccount(state) {
      return state.currentAccount;
    },
  },
  modules: {},
});
