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
			class="sr"
			type="checkbox"
			:checked="checked ?? defaultChecked"
			@click="$emit('click')"
		/>
		<i aria-hidden="true"></i>
	</span>
</template>

<style lang="less" scoped>
.tog {
	--tog-height: var(--space-l);
	--tog-offset: var(--space-xs);
	display: inline-block;
	height: var(--tog-height);
	position: relative;
	top: var(--space-xs);
	width: var(--space-xxl);
}

.tog i {
	background: var(--color-fg);
	border-radius: var(--tog-height);
	bottom: 0;
	cursor: pointer;
	display: block;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
}

.tog i::before {
	--size: calc(var(--tog-height) - (var(--tog-offset) * 2));
	background: var(--color-bg);
	border-radius: 50%;
	content: "";
	height: var(--size);
	left: var(--tog-offset);
	position: absolute;
	top: var(--tog-offset);
	width: var(--size);
}

.tog input:checked + i::before {
	left: auto;
	right: var(--tog-offset);
}
</style>
