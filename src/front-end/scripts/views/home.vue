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
	<h2>Point?</h2>
	<ol>
		<li>
			<em>(Optional)</em> Provide your name in the
			<strong>User profile</strong> section
		</li>
		<li>Create a story room with a title and voting scale</li>
		<li>Share the room URL with your team members</li>
		<li>Wait for votes to roll in</li>
		<li>Click the <strong>Reveal</strong> button to show results</li>
		<li>Take over the world! 🌎🐁</li>
	</ol>
	<ul class="links unstyled">
		<li><a href="https://github.com/haliphax/narf">source</a></li>
		<li><a href="https://haliphax.dev">author</a></li>
		<li>
			<a href="https://en.wikipedia.org/wiki/Pinky_and_the_Brain">
				nostalgia
			</a>
		</li>
	</ul>
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

.links {
	display: block;
	border-top: 0.3em dotted var(--color-bg);
	margin-top: calc(var(--space-l) * 2);
	padding-top: var(--space-l);
	text-align: center;

	li {
		display: inline-block;
	}

	li:not(:last-child) {
		margin-right: var(--space-m);
	}
}
</style>
