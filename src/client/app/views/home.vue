<script lang="ts">
import pkg from "@/../package.json";
import { defineComponent } from "vue";
import NewStory from "./home/newstory.vue";
import Profile from "./home/profile.vue";

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
		<code>
			<a
				:href="`https://github.com/haliphax/narf/releases/tag/v${version}`"
				title="Release notes"
			>
				{{ version }}
			</a>
		</code>
		<small>Simple story points estimation</small>
	</h1>
	<a name="main"></a>
	<details :open="openProfile">
		<summary>
			<span aria-hidden="true">🧑</span>
			User profile
		</summary>
		<Profile></Profile>
	</details>
	<NewStory></NewStory>
	<h2>Point?</h2>
	<ol>
		<li>
			<em>(Optional)</em> Fill out your
			<strong>User profile</strong>
			<span aria-hidden="true">☝️</span>
		</li>
		<li><strong>Create</strong> a story room with a title and scale</li>
		<li><strong>Share</strong> the room URL with your team</li>
		<li><strong>Vote</strong> on the estimate</li>
		<li><strong>Reveal</strong> the voting results</li>
		<li>Take over the world! <span aria-hidden="true">🌎🐁</span></li>
	</ol>
	<footer>
		<ul class="x">
			<li><a href="https://github.com/haliphax/narf">source</a></li>
			<li><a href="https://haliphax.dev">author</a></li>
			<li>
				<a href="https://en.wikipedia.org/wiki/Pinky_and_the_Brain">
					nostalgia
				</a>
			</li>
		</ul>
	</footer>
</template>

<style lang="less" scoped>
code {
	font-size: 0.75em;
	position: relative;
	top: -0.125em;

	a {
		color: inherit;
		text-decoration: none;

		&:hover,
		&:focus {
			text-decoration: underline;
		}
	}
}

small {
	color: var(--color-fg-subtle);
	display: block;
	font-size: 0.5em;
}

footer {
	display: block;
	border-top: 0.3em dotted var(--color-bg);
	margin-top: calc(var(--space-l) * 2);
	padding-top: var(--space-l);
	text-align: center;

	li {
		display: inline-block;
	}

	li:not(:last-child) {
		margin-right: var(--space-xl);
	}
}
</style>
