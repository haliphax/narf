<script lang="ts">
import { Component } from 'vue';
import Estimate from './components/estimate.vue';
import Participants from './components/participants.vue';
import Header from './components/header.vue';

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
