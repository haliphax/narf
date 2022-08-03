<script lang="ts">
import { Component } from 'vue';

const Header: Component = {};

export default Header;
</script>

<template>
	<h1>{{ $store.state.story.story?.title }}</h1>
</template>
