<script lang="ts">
import { Component } from 'vue';
import { estimate } from '../store/modules/story';
import { sessionState } from '../store/modules/session';
import { storyState } from '../store/modules/story';
import { participant } from '../store/modules/participants';

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
    you(): participant {
      return Object.values(this.$store.state.participants.people)
        .find((v: participant) => v.id === this.session.id);
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
        user: this.you,
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
