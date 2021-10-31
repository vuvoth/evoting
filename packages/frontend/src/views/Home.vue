<template>
  <div class="home text-center">
    <vote-form msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import VoteForm from "@/components/VoteForm.vue";

export default {
  name: "Home",
  components: {
    VoteForm,
  },
};
</script>
