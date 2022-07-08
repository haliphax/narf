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
  <h2>Participants</h2>
  <ul>
    <li v-for="p of people">
      <span>{{ p.name }}</span>
      <small v-if="p.id === session.id">&nbsp;(You)</small>
      <span v-if="p.value">&nbsp;- {{ p.value }}</span>
    </li>
  </ul>
</template>
