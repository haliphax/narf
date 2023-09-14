<script lang="ts">
import { defineComponent } from "vue";
import NewStory from "../components/newstory.vue";

const Home = defineComponent({
	components: { NewStory },
});

export default Home;
</script>

<template>
	<h1>
		narf!
		<small>Simple story points estimation</small>
	</h1>
	<NewStory></NewStory>
</template>

<style lang="less" scoped>
small {
	color: var(--color-fg-subtle);
	display: block;
	font-size: 50%;
}
</style>
