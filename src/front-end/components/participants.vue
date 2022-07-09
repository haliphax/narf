<script lang="ts">
import { Component } from 'vue';
import { participant } from '../types';

const Participants: Component = {
  computed: {
    people(): Record<string, participant> {
      return this.$store.state.participants.people;
    },
    session() {
      return this.$store.state.session;
    },
  },
};

export default Participants;
</script>

<template>
  <div>
    <h2>Participants</h2>
    <ul class="unstyled">
      <li v-for="p of people">
        <span class="name">{{ p.name }}</span>
        <span class="you" v-if="p.id === session.id">(You)</span>
        <span class="value" v-if="p.value">
          <span v-if="revealed">{{ p.value }}</span>
          <span v-else>?</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  background-color: var(--bg-color);
  display: block;
  padding: .5em 1em;
  margin-bottom: .25rem;
}

.name {
  margin-right: .5em;
}

.you {
  font-size: .75em;
  opacity: 0.8;
}

.value {
  background-color: var(--secondary-bg-color);
  color: var(--secondary-color);
  float: right;
  padding: 0 .25em;
}
</style>
