<template>
  <div class="vote-form p-3" v-cloak>
    <div v-if="getSignerAddress !== ''">
      <p>Connect Account: {{ getSignerAddress }}</p>
      <p>Balance : {{ balance }}</p>
    </div>
    <div id="form">
      <form
        @submit.prevent="fetchSessionData"
        class="text-center content-center mb-3 p-3"
      >
        Your Vote session ID
        <input
          class="text-gray-700 text-sm font-bold mb-3 p-2"
          type="text"
          v-model="sessionId"
        />

        <input type="submit" value="Fetch information" />
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
          class="bg-blue-500 hover:bg-blue-700 text-white p-3 m-3"
        />
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import offchain from "@evoting/offchain";
import * as snarkjs from "snarkjs/build/main.cjs";

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
    };
  },
  components: {},
  methods: {
    fetchSessionData() {
      axios
        .get(`http://localhost:4040/session/${this.sessionId}`)
        .then((result) => {
          this.sessionData = result.data;
        })
        .catch((err) => {
          console.log("This is error", err);
        });
    },
    async voteAction() {
      const candidateId = this.sessionData.result.findIndex(
        (data) => data.candidate === this.voteCandidate
      );
      axios
        .get(`http://localhost:4040/zkproof/${this.sessionId}`)
        .then(async (result) => {
          const data = result.data;
          const secretInput = offchain.createMerkleProof(
            this.ticket,
            offchain.toBNs(data.mTree)
          );
          secretInput.data["candidate"] = candidateId.toString();
          const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            secretInput.data,
            "http://localhost:4040/merkleTree.wasm",
            "http://localhost:4040/merkle_final.zkey"
          );

          const relayData = {
            voteCode: publicSignals[1],
            candidateCode: publicSignals[2],
            candidate: candidateId.toString(),
            proof: offchain.solidityZKPoints(proof),
          };

          axios
            .post("http://localhost:4040/relay/" + this.sessionId, relayData)
            .then((res) => {
              console.log(res);
              axios
                .get(`http://localhost:4040/session/${this.sessionId}`)
                .then((result) => {
                  this.sessionData = result.data;
                })
                .catch((err) => {
                  console.log("This is error", err);
                });
            });
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
