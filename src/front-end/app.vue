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
  <Actions class="actions"></Actions>
  <div class="grid">
    <Participants class="participants"></Participants>
    <Estimate class="estimates"></Estimate>
  </div>
</template>

<style scoped>
  .grid {
    grid-auto-columns: auto;
    grid-auto-flow: row;
  }

  .participants {
    grid-column: 1 / span 2;
    grid-row: 2;
  }

  .estimates {
    grid-column: 1 / span 2;
    grid-row: 1;
  }

  .actions {
    grid-column: 1 / span 2;
    padding-top: 1rem;
  }

  @media screen and (min-width: 640px) {
    .grid {
      grid-template-columns:
        calc(40% - var(--grid-gap) / 2)
        calc(60% - var(--grid-gap) / 2);
    }

    .participants {
      grid-column: 1 / span 1;
      grid-row: 1;
    }

    .estimates {
      grid-column: 2 / span 1;
      grid-row: 1;
    }
  }
</style>
