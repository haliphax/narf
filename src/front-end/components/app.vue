<script lang="ts">
import { Component } from 'vue';
import Estimate from './estimate.vue';
import Participants from './participants.vue';
import StoryTitle from './storytitle.vue';

const App: Component = {
  components: {
    Estimate,
    Participants,
    StoryTitle,
  },
};

export default App;
</script>

<template>
  <StoryTitle></StoryTitle>
  <Participants></Participants>
  <Estimate></Estimate>
  <!--
    - Action buttons
  -->
</template>
