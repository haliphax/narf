import { Component } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { ROOT_URI } from "./constants";
import Home from "./views/home.vue";
import Story from "./views/story.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: `${ROOT_URI}`,
			component: Home as unknown as Component,
			name: "home",
		},
		{
			path: `${ROOT_URI}:story`,
			component: Story as unknown as Component,
			name: "story",
		},
	],
});

export default router;
