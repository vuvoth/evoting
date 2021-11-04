<template>
  <div class="home text-center">
    <create-vote-session />
  </div>
</template>

<script>
// @ is an alias to /src
import CreateVoteSession from "@/components/Create.vue";

export default {
  name: "CreateSession",
  components: {
    CreateVoteSession,
  },
};
</script>
