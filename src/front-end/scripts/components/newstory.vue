<script lang="ts">
import { defineComponent } from "vue";
import scales from "../../../scales";
import router from "../router";
import { remult } from "remult";
import { Story } from "../../../models/story";

interface NewStoryProps {
	scale: string;
	scales: readonly string[];
	title: string;
}

const NewStory = defineComponent({
	data(): NewStoryProps {
		const opts: Array<string> = [];
		const scaleIter = scales.keys();
		let next: IteratorResult<string>;

		while ((next = scaleIter.next())) {
			if (next.done) break;

			opts.push(next.value);
		}

		return {
			scale: this.$store.state.session.settings.scale,
			scales: opts,
			title: "",
		};
	},
	watch: {
		scale() {
			this.$store.commit("session.settings", { scale: this.scale });
		},
	},
	methods: {
		async submit() {
			const storyRepo = remult.repo(Story);
			const story = await storyRepo.insert({
				owner: this.$store.state.session.id,
				scale: this.scale,
				title: this.title,
			});

			router.push({ name: "story", params: { story: story.id } });
		},
	},
});

export default NewStory;
</script>

<template>
	<form @submit.prevent="submit()">
		<fieldset class="grid">
			<legend>New room</legend>
			<span>
				<label for="title">Title:</label>
				<input id="title" v-model="title" type="text" required />
			</span>
			<span>
				<label for="scale">Scale:</label>
				<select id="scale" v-model="scale" required>
					<option v-for="(s, idx) in scales" :key="idx">{{ s }}</option>
				</select>
			</span>
			<span>
				<button type="submit">Create</button>
			</span>
		</fieldset>
	</form>
</template>

<style lang="less" scoped>
@import "../../styles/breakpoints.less";

@media @breakpoint_m {
	.grid > span {
		grid-area: 1 / span 3;
	}
}
</style>
