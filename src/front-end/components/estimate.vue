<script lang="ts">
import { Component } from 'vue';
import { estimate, participant, sessionState, storyState } from '../types';

const FIBONACCI = ['0', '1/2', '1', '2', '3', '5', '8', '13', '💬'] as const;
const TSHIRTS = ['XS', 'S', 'M', 'L', 'XL', '💬'] as const;

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
    options(): Readonly<Array<string>> { return modeMap[this.mode as mode]; },
    session(): sessionState { return this.$store.state.session; },
    story(): storyState { return this.$store.state.story; },
    you(): participant | undefined {
      return Object.values<participant>(this.$store.state.participants.people)
        .find(v => v.id === this.session.id);
    },
  },
  data(): pointsData {
    return { mode: mode.Fibonacci };
  },
  methods: {
    classes(option: string) {
      const classes = [];

      if (this.you?.value == option)
        classes.push('chosen');

      return classes;
    },
    setEstimate(option: string) {
      const estimate: estimate = {
        user: {
          id: this.session.id,
          name: this.session.name,
        },
        value: option == this.you?.value ? null : option,
      };

      this.$store.dispatch('estimate', estimate);
    },
  },
};

export default Estimate;
</script>

<template>
  <div>
    <h2>Estimate</h2>
    <ul class="unstyled grid">
      <li v-for="option in options">
        <button @click="setEstimate(option)" :class="classes(option)"
          :disabled="story.revealed">
          {{ option }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
button {
  height: 10vh;
  margin: 0;
  padding: 0;
  width: 100%;
}

.grid {
  grid-template-columns: auto auto auto;
}

.chosen {
  background-color: var(--secondary-bg-color);
  color: var(--secondary-color);
}

@media screen and (min-width: 540px) {
  .grid {
    grid-template-columns: auto auto auto auto;
  }
}

@media screen and (min-width: 768px) {
  .grid {
    grid-template-columns: auto auto auto auto auto auto;
  }
}
</style>
