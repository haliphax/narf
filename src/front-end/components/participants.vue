<script lang="ts">
import { Component } from 'vue';
import { participantsState, sessionState, storyState } from '../types';

const Participants: Component = {
  computed: {
    participants(): participantsState {
      return this.$store.state.participants;
    },
    session(): sessionState { return this.$store.state.session; },
    story(): storyState { return this.$store.state.story; }
  },
};

export default Participants;
</script>

<template>
  <div>
    <h2>Participants</h2>
    <ul class="unstyled">
      <li class="grid" v-for="p of participants.people">
        <span class="name">
          {{ p.name }}
          <span class="you" v-if="p.id === session.id">(You)</span>
        </span>
        <span class="value" v-show="p.value">
          <span v-if="story.revealed">{{ p.value }}</span>
          <span v-else>?</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  grid-auto-flow: row;
  grid-template-columns: auto min-content;
  padding: .5em 1em;
  margin-bottom: .25rem;
}

li:nth-child(2n) {
  background-color: var(--bg-color);
}

.name {
  margin-right: .5em;
}

.you {
  font-size: .75em;
  opacity: 0.8;
}

.value > * {
  background-color: var(--secondary-bg-color);
  color: var(--secondary-color);
  padding: .125em .25em;
}
</style>
