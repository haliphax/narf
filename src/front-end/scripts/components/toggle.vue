<script lang="ts">
import { defineComponent } from "vue";

const Toggle = defineComponent({
	props: {
		// eslint-disable-next-line vue/require-prop-types
		checked: {
			default: null,
		},
		id: {
			type: String,
			default: "",
		},
	},
	emits: ["click"],
	data() {
		return {
			defaultChecked: false,
		};
	},
	methods: {
		defaultToggle() {
			this.defaultChecked = !this.defaultChecked;
		},
	},
});

export default Toggle;
</script>

<template>
	<span class="tog">
		<input
			:id="id"
			class="sr-only"
			type="checkbox"
			:checked="checked ?? defaultChecked"
			@click="$emit('click')"
		/>
		<i aria-hidden="true"></i>
	</span>
</template>

<style lang="less" scoped>
.tog {
	--tog-c-back: var(--color-bg);
	--tog-c-back-on: var(--color-bg);
	--tog-c-dim: calc(var(--tog-height) - (var(--tog-c-offset) * 2));
	--tog-c-offset: var(--space-xs);
	--tog-height: var(--space-l);
	--tog-off: var(--color-fg);
	--tog-on: var(--color-fg);
	--tog-width: var(--space-xxl);
	display: inline-block;
	height: var(--tog-height);
	position: relative;
	top: var(--space-xs);
	width: var(--tog-width);
}

.tog i {
	bottom: 0;
	left: 0;
	right: 0;
	background: var(--tog-off);
	border-radius: var(--tog-height);
	cursor: pointer;
	display: block;
	position: absolute;
	top: 0;
}

.tog i::before {
	background: var(--tog-c-back);
	border-radius: 50%;
	content: "";
	height: var(--tog-c-dim);
	left: var(--tog-c-offset);
	position: absolute;
	top: var(--tog-c-offset);
	width: var(--tog-c-dim);
}

.tog input:checked + i::before {
	left: auto;
	right: var(--tog-c-offset);
}
</style>
