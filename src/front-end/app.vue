<script lang="ts">
import { Component } from 'vue';
import Actions from './components/actions.vue';
import Estimate from './components/estimate.vue';
import Header from './components/header.vue';
import Participants from './components/participants.vue';

const App: Component = {
  components: {
    Actions,
    Estimate,
    Header,
    Participants,
  },
};

export default App;
</script>

<template>
  <Header></Header>
  <div class="grid">
    <Participants></Participants>
    <Estimate></Estimate>
    <!-- Action buttons -->
  </div>
  <Actions></Actions>
</template>

<style scoped>
  .grid {
    grid-template-columns: auto;
  }

  @media screen and (min-width: 540px) {
    .grid {
      grid-template-columns: 30% 70%;
    }
  }
</style>
