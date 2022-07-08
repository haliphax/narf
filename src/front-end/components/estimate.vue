<script lang="ts">
import { Component } from 'vue';
import { estimate, participant, sessionState, storyState } from '../types';

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
    you(): participant | undefined {
      return Object.values<participant>(this.$store.state.participants.people)
        .find(v => v.id === this.session.id);
    },
    options(): Readonly<Array<string>> {
      return modeMap[this.mode as mode];
    },
    session(): sessionState {
      return this.$store.state.session;
    },
    story(): storyState {
      return this.$store.state.story;
    },
  },
  data(): pointsData {
    return {
      mode: mode.Fibonacci,
    };
  },
  methods: {
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
  <h2>Estimate</h2>
  <ul>
    <li v-for="option in options">
      <button @click="setEstimate(option)">
        <span v-if="option === you?.value">*</span>
        {{ option }}
      </button>
    </li>
  </ul>
</template>
