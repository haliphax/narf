import { Component } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/home.vue";
import Story from "./views/story.vue";

const rootURI = (document.getElementById("rootURI") as HTMLInputElement).value;

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: `${rootURI}`,
			component: Home as unknown as Component,
			name: "home",
		},
		{
			path: `${rootURI}:story`,
			component: Story as unknown as Component,
			name: "story",
		},
	],
});

export default router;
