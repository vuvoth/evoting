<template>
  <div>
    <button
      v-on:click="connect"
      class="
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        rounded
      "
    >
      Connect Metamask
    </button>
  </div>
</template>

<script>
export default {
  name: "ConnectButtion",
  methods: {
    connect: function () {
      this.$store.dispatch("connectToMetamask", null, { root: true });
    },
  },
};
</script>
