<script lang="ts">
import { defineComponent } from "vue";

const Profile = defineComponent({
	data() {
		return {
			name: this.$store.state.session.name,
			upToDate: true,
		};
	},
	watch: {
		name() {
			this.upToDate = false;
		},
	},
	methods: {
		submit() {
			this.$store.commit("session.settings.name", this.name);
			this.upToDate = true;
		},
	},
});

export default Profile;
</script>

<template>
	<form @submit.prevent="submit()">
		<fieldset class="grid">
			<legend>Profile</legend>
			<span>
				<label for="name">Name:</label>
				<input id="name" v-model="name" type="text" required />
			</span>
			<span>
				<button type="submit" :disabled="upToDate">Update</button>
			</span>
		</fieldset>
	</form>
</template>

<style lang="less" scoped>
@import "../../styles/breakpoints.less";

@media @breakpoint_m {
	.grid > span {
		grid-area: 1 / span 2;
	}
}
</style>
