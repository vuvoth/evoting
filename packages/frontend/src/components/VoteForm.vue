<template>
  <div class="vote-form m-10" v-cloak>
    <div class="text-center content-center m-10 p-10">
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
            v-model="sessionId"
            placeholder="Type your session id here"
          />
          <button
            class="
              flex-shrink-0
              bg-green-500
              honver:bg-green-700
              text-sm
              border-1
              py-1
              px-2
              rounded
            "
            type="button"
            @click="fetchSessionData"
          >
            Fetch Session
          </button>
        </div>
      </form>
    </div>
    <ul>
      <p>Quesion : {{ sessionData.question }}</p>
      <li v-for="(candidate, index) in sessionData.result" v-bind:key="index">
        {{ candidate.candidate }} - {{ candidate.vote }}
      </li>
    </ul>

    <div id="vote" v-if="sessionData.result.length > 0">
      <form
        @submit.prevent="voteAction"
        class="text-center content-center mb-3 p-3"
      >
        Ticket
        <input
          class="
            shadow
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-gray-700
            leading-tight
            focus:outline-none focus:shadow-outline
          "
          type="text"
          v-model="ticket"
        />
        Candidate
        <select
          class="
            block
            appearance-none
            content-center
            bg-white
            border border-gray-400
            hover:border-gray-500
            px-4
            py-2
            pr-8
            rounded
            shadow
            leading-tight
            focus:outline-none focus:shadow-outline
            w-full
          "
          v-model="voteCandidate"
        >
          <option
            v-for="(candidate, index) in sessionData.result"
            v-bind:key="index"
            class="text-center"
          >
            {{ candidate.candidate }}
          </option>
        </select>

        <input
          type="submit"
          value="Vote"
          class="bg-green-500 hover:bg-green-700 text-white p-4 m-3 w-1/6"
        />
      </form>
    </div>

    <div>
      <!-- <p v-if="status == 1">Creating Vote Session....</p> -->
      <p v-if="status == 2">
        Finished vote for {{ voteCandidate }} at {{ hash }}
      </p>
    </div>

    <div v-if="status == 1" class="flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"
      ></div>
    </div>
  </div>
</template>

<script>
import offchain from "@evoting/offchain";
import services from "../services/Service";
import zkProof from "../logics/zkProof.js";

export default {
  name: "VoteForm",
  data: function () {
    return {
      sessionId: 0,
      ticket: "",
      voteCandidate: "",
      sessionData: {
        question: "",
        result: [],
      },
      hash: "",
      status: 0,
    };
  },
  components: {},
  methods: {
    fetchSessionData() {
      services
        .getSession(this.sessionId)
        .then((result) => {
          this.sessionData = result.data;
        })
        .catch((err) => {
          console.log("This is error", err);
        });
    },
    async voteAction() {
      this.status = 1;
      const candidateId = this.sessionData.result.findIndex(
        (data) => data.candidate === this.voteCandidate
      );

      services.getMerkleTree(this.sessionId).then(async (result) => {
        const data = result.data;
        const { proof, publicSignals } = await zkProof(
          this.ticket,
          candidateId,
          data.mTree
        );

        const relayData = {
          voteCode: publicSignals[1],
          candidateCode: publicSignals[2],
          candidate: candidateId.toString(),
          proof: offchain.solidityZKPoints(proof),
        };

        services.relayVote(this.sessionId, relayData).then((res) => {
          this.fetchSessionData(this.sessionId);
          this.hash = res.data.txHash;
          this.status = 2;
        });
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
    candidates() {
      return this.sessionData;
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
