<template>
  <div class="home text-center">
    <connect-button />
    <div v-if="getSignerAddress !== ''">
      <p>Connect Account: {{ getSignerAddress }}</p>
      <p>Balance : {{ balance }}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ConnectButton from "../components/ConnectButton.vue";

export default {
  name: "Vote",
  components: {
    ConnectButton,
  },
  computed: {
    getSignerAddress() {
      return this.$store.getters.getCurrentAccount;
    },
    balance() {
      return this.$store.state.balance;
    }
  },
};
</script>
