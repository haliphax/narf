<script lang="ts">
import { Component } from 'vue';

const FIBONACCI = ['1', '2', '3', '5', '8', '13', '?'] as const;
const TSHIRTS = ['S', 'M', 'L', 'XL'] as const;

enum mode {
  Fibonacci,
  TShirts,
};

const modeMap = {
  [mode.Fibonacci]: FIBONACCI,
  [mode.TShirts]: TSHIRTS,
};

type pointsData = {
  mode: mode,
};

const Estimate: Component = {
  computed: {
    options(): Readonly<Array<string>> {
      return modeMap[this.mode as mode];
    }
  },
  data(): pointsData {
    return {
      mode: mode.Fibonacci,
    };
  },
};

export default Estimate;
</script>

<template>
  <h2>Estimate</h2>
  <ul>
    <li v-for="option in options">
      {{ option }}
    </li>
  </ul>
</template>
