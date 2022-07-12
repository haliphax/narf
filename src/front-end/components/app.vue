<script lang="ts">
import { Component } from 'vue';
import Actions from './actions.vue';
import DarkMode from './darkmode.vue';
import Estimate from './estimate.vue';
import Header from './header.vue';
import Participants from './participants.vue';

const App: Component = {
  components: {
    Actions,
    DarkMode,
    Estimate,
    Header,
    Participants,
  },
};

export default App;
</script>

<template>
  <DarkMode></DarkMode>
  <Header></Header>
  <Actions class="actions"></Actions>
  <div class="grid">
    <Participants class="participants"></Participants>
    <Estimate class="estimates"></Estimate>
  </div>
</template>

<style lang="less" scoped>
@import '../styles/variables.less';

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
  padding-top: var(--space-m);
}

@media @breakpoint_m {
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
