<script lang="ts">
import { defineComponent } from "vue";

const Heading = defineComponent({});

export default Heading;
</script>

<template>
	<h1>{{ $store.state.story.story?.title ?? "Loading..." }}</h1>
</template>
