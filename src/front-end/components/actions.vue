<script lang="ts">
import { Component } from 'vue';
import { storyState } from '../types';

const Actions: Component = {
  computed: {
    story(): storyState { return this.$store.state.story; },
  },
  methods: {
    reveal() { this.$store.dispatch('reveal'); },
  },
};

export default Actions;
</script>

<template>
  <ul class="unstyled">
    <li>
      <button @click="reveal" :disabled="story.revealed">Reveal</button>
    </li>
  </ul>
</template>
