<template>
  <div class="home text-center">
    <vote-form />
  </div>
</template>

<script>
// @ is an alias to /src
import VoteForm from "@/components/VoteForm.vue";

export default {
  name: "CreateSession",
  components: {
    VoteForm,
  },
};
</script>
