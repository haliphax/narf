<script lang="ts">
import { defineComponent } from "vue";

const Home = defineComponent({});

export default Home;
</script>

<template>
	<h1>
		narf!
		<small>Simple story points estimation</small>
	</h1>
	<router-link :to="{ name: 'story', params: { story: 1 } }">Demo</router-link>
</template>

<style lang="less" scoped>
small {
	color: var(--color-fg-subtle);
	display: block;
	font-size: 50%;
}
</style>
