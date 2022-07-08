<script lang="ts">
import { Component } from 'vue';

const Participants: Component = {
  computed: {
    participants() {
      return this.$store.state.participants;
    },
  },
};

export default Participants;
</script>

<template>
  <h2>Participants</h2>
  <ul>
    <li v-for="participant in participants">
      {{ participant.name }}
    </li>
  </ul>
</template>
