<script lang="ts">
import { defineComponent } from "vue";
import scales from "../../../scales";
import { ROOT_URI } from "../constants";
import router from "../router";

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
			scale: opts[0],
			scales: opts,
			title: "",
		};
	},
	methods: {
		async submit() {
			const resp = await fetch(`${ROOT_URI}story`, {
				body: JSON.stringify({
					scale: this.scale,
					title: this.title,
				}),
				headers: { "Content-Type": "application/json" },
				method: "PUT",
			}).then((r) => r.json());

			router.push({ name: "story", params: { story: resp.id } });
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

button {
	margin: auto;
}

fieldset {
	padding: var(--space-m) var(--space-l);
}

label {
	margin: auto;
	padding-right: var(--space-s);
}

.grid > span {
	display: flex;
	flex-direction: row;

	input,
	select {
		flex-grow: 1;
	}
}

@media @breakpoint_m {
	.grid > span {
		grid-area: 1 / span 3;
	}
}
</style>
