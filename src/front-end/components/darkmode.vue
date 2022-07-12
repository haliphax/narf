<script lang="ts">
import { Component } from 'vue';

const DarkMode: Component = {
  methods: {
    toggle() { document.body.classList.toggle('dark-mode'); },
  },
  mounted() {
    if (matchMedia('prefers-color-scheme: dark').matches)
      this.toggle();
  },
};

export default DarkMode;
</script>

<template>
  <ul class="unstyled">
    <li>
      <button @click="toggle()">Dark mode</button>
    </li>
  </ul>
</template>

<style scoped>
</style>
