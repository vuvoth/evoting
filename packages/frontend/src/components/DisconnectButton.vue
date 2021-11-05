<template>
  <div>
    <button
      v-on:click="disconnect"
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Disconnect Metamask
    </button>
  </div>
</template>

<script>
export default {
  name: "DisconnectButtion",
  methods: {
    disconnect: function () {
      this.$store.dispatch("disconnectFromMetaMask", null, { root: true });
    },
  },
};
</script>
