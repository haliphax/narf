<script lang="ts">
import { Component } from 'vue';

const Heading: Component = {};

export default Heading;
</script>

<template>
	<h1>{{ $store.state.story.story?.title }}</h1>
</template>
