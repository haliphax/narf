import { Component } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/home.vue";
import Room from "./views/room.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			component: Home as unknown as Component,
			name: "home",
		},
		{
			path: "/:story",
			component: Room as unknown as Component,
			name: "story",
		},
	],
});

export default router;
