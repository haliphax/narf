<script lang="ts">
import { defineComponent } from "vue";
import NewStory from "../components/newstory.vue";
import Profile from "../components/profile.vue";

const Home = defineComponent({
	components: {
		NewStory,
		Profile,
	},
	data() {
		return {
			openProfile: this.$store.state.session.name === "User",
		};
	},
});

export default Home;
</script>

<template>
	<h1>
		narf!
		<small>Simple story points estimation</small>
	</h1>
	<details :open="openProfile">
		<summary>🧑 User profile</summary>
		<Profile></Profile>
	</details>
	<NewStory></NewStory>
</template>

<style lang="less" scoped>
small {
	color: var(--color-fg-subtle);
	display: block;
	font-size: 50%;
}
</style>
