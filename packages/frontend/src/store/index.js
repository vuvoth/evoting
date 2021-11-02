import { createStore } from "vuex";

import { ethers } from "ethers";

export default createStore({
  state: {
    voteSessions: [],
    signer: Object,
    provider: Object,
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

      console.log("Change");
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
