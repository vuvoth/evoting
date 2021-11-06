<template>
  <div class="vote-form p-3" v-cloak>
    <div id="form">
      <form
        @submit.prevent="createVoteSession"
        class="text-center content-center mb-3 p-3"
      >
        Vote Session Seed
        <input
          class="text-gray-700 text-sm font-bold mb-3 p-2"
          type="text"
          v-model="seed"
        />

        <input type="submit" value="Create Vote Session" />
      </form>
    </div>
    <div>
      <ul>
        <li v-for="(ticket, index) in tickets" v-bind:key="index">
          {{ ticket }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import offchain from "@evoting/offchain";
import axios from "axios";
import { ethers } from "ethers";
import services from "../services/Service";

export default {
  name: "CreateVoteSession",
  data: function () {
    return {
      sessionId: 0,
      tickets: [],
      seed: "",
    };
  },
  components: {},
  methods: {
    createVoteSession() {
      const { root, mTree, tickets } = offchain.createVoteSession(4, this.seed);

      const contract = this.$store.state.contract;

      this.tickets = tickets;
      contract
        .createVoteSession(root)
        .then(async (tx) => {
          let recepit = await tx.wait();
          const data = recepit.events[0].data;
          const decodeData = ethers.utils.defaultAbiCoder.decode(
            ["address", "uint256"],
            data
          );
          services.postMerkleTree(
            decodeData[1].toString(),
            mTree.map((node) => node.toString())
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    getSignerAddress() {
      return this.$store.getters.getCurrentAccount;
    },
    isConnected() {
      return this.$store.state.isConnected;
    },
    balance() {
      return this.$store.state.balance;
    },
  },
  mounted() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        this.$store.dispatch("changeAccounts", accounts, { root: true });
      });
    }
  },
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
