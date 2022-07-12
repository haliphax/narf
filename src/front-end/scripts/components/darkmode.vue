<script lang="ts">
import { Component } from 'vue';
import { sessionState } from '../types';

const DarkMode: Component = {
  computed: {
    session(): sessionState { return this.$store.state.session; },
  },
  methods: {
    toggle() {
      const val = document.body.classList.toggle('dark-mode');

      this.$store.commit('session.darkMode', val);
    },
  },
  mounted() {
    if (matchMedia('prefers-color-scheme: dark').matches
      || (this.session as sessionState).darkMode)
    {
      this.toggle();
    }
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
