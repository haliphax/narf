<script lang="ts">
import { Component } from 'vue';

const StoryTitle: Component = {
  computed: {
    title() {
      return this.$store.state.storyTitle;
    }
  },
};

export default StoryTitle;
</script>

<template>
  <h1>{{ title }}</h1>
</template>
