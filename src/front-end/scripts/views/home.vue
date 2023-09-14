<script lang="ts">
import { defineComponent } from "vue";
import NewStory from "../components/newstory.vue";
import Profile from "../components/profile.vue";
import pkg from "../../../../package.json";

const Home = defineComponent({
	components: {
		NewStory,
		Profile,
	},
	data() {
		return {
			openProfile: this.$store.state.session.name === "User",
			version: pkg.version,
		};
	},
});

export default Home;
</script>

<template>
	<h1>
		narf!
		<code>{{ version }}</code>
		<small>Simple story points estimation</small>
	</h1>
	<details :open="openProfile">
		<summary>🧑 User profile</summary>
		<Profile></Profile>
	</details>
	<NewStory></NewStory>
</template>

<style lang="less" scoped>
code {
	font-size: 0.75em;
	position: relative;
	top: -0.25em;
}

small {
	color: var(--color-fg-subtle);
	display: block;
	font-size: 0.5em;
}
</style>
