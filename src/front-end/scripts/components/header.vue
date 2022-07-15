<script lang="ts">
import { Component } from 'vue';

const Header: Component = {
	computed: {
		story() { return this.$store.state.story; },
	},
};

export default Header;
</script>

<template>
	<h1>{{ story.title }}</h1>
</template>
