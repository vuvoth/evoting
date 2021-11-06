<template>
  <div class="text-center p-10 m-10">
    <form class="text-center w-full">
      <div class="flex items-center border-b border-teal-500 py-2">
        <input
          class="
            appearance-none
            bg-transparent
            border-none
            w-full
            text-gray-700
            mr-3
            py-1
            px-2
            leading-tight
            focus:outline-none
          "
          type="text"
          v-model="seed"
          placeholder="Type your seed here"
        />
        <button
          class="
            flex-shrink-0
            bg-teal-500
            hover:bg-teal-700
            border-teal-500
            hover:border-teal-700
            text-sm
            border-4
            text-black
            py-1
            px-2
            rounded
          "
          type="button"
          @click="createVoteSession"
        >
          Create Vote
        </button>
      </div>
    </form>
  </div>

  <div>
    <p v-if="status == 2">Finished create with sessionId = {{ sessionId }}</p>
  </div>
  <div v-if="status == 1" class="flex justify-center items-center">
    <div
      class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"
    ></div>
  </div>
</template>

<script>
// import axios from "axios";
import offchain from "@evoting/offchain";
import { ethers } from "ethers";
import services from "../services/Service";
import { saveAs } from "file-saver";

export default {
  name: "CreateVoteSession",
  data: function () {
    return {
      sessionId: 0,
      tickets: [],
      seed: "",
      status: 0,
    };
  },
  components: {},
  methods: {
    createVoteSession() {
      this.status = 1;
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
          this.sessionId = decodeData[1].toString();
          services.postMerkleTree(this.sessionId, mTree).then((result) => {
            this.saveMetadata(tickets, mTree, this.sessionId);
            this.status = 2;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    saveMetadata(tickets, mTree, sessionId) {
      const meta = {
        sessionId,
        tickets,
        mTree,
      };

      const blob = new Blob([JSON.stringify(meta, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, `${sessionId}_VoteSessionMeta.json`);
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
