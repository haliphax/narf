import { Component } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Room from './components/room.vue';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/:story',
			component: (Room as unknown) as Component,
		}
	],
});

export default router;
