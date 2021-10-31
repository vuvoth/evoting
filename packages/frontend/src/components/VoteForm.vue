<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <connect-button />
    <div v-if="isConnected">
      <p>Connect Account: {{ getSignerAddress }}</p>
      <p>Balance : {{ balance }}</p>
    </div>
  </div>
</template>

<script>
import ConnectButton from "./ConnectButton.vue";
export default {
  name: "VoteForm",
  props: {
    msg: String,
  },
  components: {
    ConnectButton,
  },
  methods: {},
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
