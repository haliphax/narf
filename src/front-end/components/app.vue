<script lang="ts">
import { Component } from 'vue';
import Estimate from './estimate.vue';
import Participants from './participants.vue';
import Header from './header.vue';

const App: Component = {
  components: {
    Estimate,
    Header,
    Participants,
  },
};

export default App;
</script>

<template>
  <Header></Header>
  <Participants></Participants>
  <Estimate></Estimate>
  <!--
    - Action buttons
  -->
</template>
