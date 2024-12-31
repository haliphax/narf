<script lang="ts">
import { ROOT_URI } from "@/front-end/app/constants";
import remult from "@/front-end/app/remult";
import router from "@/front-end/app/router";
import { StoreState } from "@/front-end/app/store/types";
import { Story as StoryModel } from "@/models/story";
import { Vote } from "@/models/vote";
import { defineComponent } from "vue";
import { Module } from "vuex";
import Actions from "./story/actions.vue";
import Estimate from "./story/estimate.vue";
import Participants from "./story/participants.vue";
import { StoryState, StoryStoreState } from "./story/types";

const storyModule: Module<StoryState, StoreState | StoryStoreState> = {
	actions: {
		async "story.join"(ctx) {
			const rootState = ctx.rootState as StoreState;
			const storyId = router.currentRoute.value.params.story as string;
			const events = new EventSource(`${ROOT_URI}${storyId}/events`);

			events.addEventListener("message", async () => {
				console.log("Story update received");
				await ctx.dispatch("story.load");
			});
			ctx.commit("events", events);

			const storyRepo = remult.repo(StoryModel);
			const voteRepo = remult.repo(Vote);
			const partial = {
				participantId: rootState.session.id,
				participantName: rootState.session.name,
				storyId,
			};

			if (
				(await storyRepo.count({ id: storyId, revealed: true })) === 0 &&
				(await voteRepo.count({
					participantId: partial.participantId,
					storyId,
				})) === 0
			) {
				await voteRepo.insert(partial);
			}

			await ctx.dispatch("story.load");
		},
		async "story.load"(ctx) {
			const story = await remult
				.repo(StoryModel)
				.findId(router.currentRoute.value.params.story.toString(), {
					useCache: false,
				});

			ctx.commit("story", story);

			if (story?.revealed) ctx.state.events?.close();
		},
		async "story.reveal"(ctx) {
			if (!ctx.state.story) return;

			await remult.repo(StoryModel).update(ctx.state.story.id, {
				revealed: true,
			});
		},
		async "story.vote"(ctx, payload: Vote) {
			if (!ctx.state.story) return;

			await remult.repo(Vote).save(payload);
		},
	},
	mutations: {
		events(state, payload: EventSource | undefined) {
			if (!payload) state.events?.close();

			state.events = payload;
		},
		story(state, payload: StoryModel) {
			state.story = payload;
		},
	},
	state() {
		return {
			events: undefined,
			story: undefined,
		};
	},
};

const Story = defineComponent({
	components: {
		Actions,
		Estimate,
		Participants,
	},
	props: {
		id: {
			default: "main",
			type: String,
		},
	},
	computed: {
		storyState() {
			return (this.$store.state as unknown as StoryStoreState).story;
		},
	},
	async created() {
		this.$store.registerModule("story", storyModule);
		await this.$store.dispatch("story.join");

		this.$store.subscribeAction(async (o) => {
			if (!["close", "confirmed"].includes(o.type) || o.payload !== "paused") {
				return;
			}

			await this.$store.dispatch("story.join");
		});

		if (this.storyState.events) {
			setTimeout(
				async () => {
					this.storyState.events?.close();
					await this.$store.dispatch("alert", {
						id: "paused",
						text: "Live updates paused. Close this alert to resume.",
					});
				},
				1000 * 60 * 10, // 10 minutes
			);
		}
	},
	unmounted() {
		this.$store.commit("story", undefined);
		this.$store.commit("events", undefined);
	},
});

export default Story;
</script>

<template>
	<h1 :id="id">
		<span v-if="!storyState.story">⏳ Loading&hellip;</span>
		<span v-else>
			<span class="sr">Story title:</span>
			{{ storyState.story?.title }}
		</span>
	</h1>
	<Actions class="a"></Actions>
	<div class="g">
		<Participants class="p"></Participants>
		<Estimate class="e"></Estimate>
	</div>
</template>

<style lang="less" scoped>
@import "@/front-end/styles/breakpoints.less";

.a {
	grid-column: 1 / span 2;
	padding-top: var(--space-m);
}

.e {
	grid-column: 1 / span 2;
	grid-row: 1;
}

.g {
	grid-auto-columns: auto;
	grid-auto-flow: row;
}

.p {
	grid-column: 1 / span 2;
	grid-row: 2;
}

@media @breakpoint_m {
	.e {
		grid-column: 2 / span 1;
		grid-row: 1;
	}

	.g {
		grid-template-columns: calc(40% - var(--space-xl) / 2) calc(
				60% - var(--space-xl) / 2
			);
		column-gap: var(--space-xl);
	}

	.p {
		grid-column: 1 / span 1;
		grid-row: 1;
	}
}
</style>
