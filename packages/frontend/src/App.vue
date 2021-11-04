<template>
  <div id="nav" class="text-center p-3 font-mono">
    <connect-button />
    <router-link to="/vote">Vote</router-link> |
    <router-link to="/create">Create Vote Session</router-link>
  </div>
  <router-view />
</template>

<script>
import ConnectButton from "./components/ConnectButton.vue";
export default {
  components: { ConnectButton },
};
</script>
