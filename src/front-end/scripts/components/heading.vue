<script lang="ts">
import { defineComponent } from "vue";

const Heading = defineComponent({});

export default Heading;
</script>

<template>
	<h1>
		<span v-if="!$store.state.story.story" aria-hidden="true">&nbsp;</span>
		{{ $store.state.story.story?.title }}
	</h1>
</template>
