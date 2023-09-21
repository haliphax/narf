<script lang="ts">
import { defineComponent } from "vue";
import { SessionState } from "../store/types";

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
		exportSession() {
			const link = document.createElement("a");
			const content = JSON.stringify(this.$store.state.session);

			link.href = `data:application/json,${content}`;
			link.download = "narf.json";
			link.click();
		},
		importSession() {
			(this.$refs.file as HTMLInputElement).click();
		},
		async loadFile() {
			const files = (this.$refs.file as HTMLInputElement).files;

			if (!files || files.length === 0) return;
			if (files.length > 1) return alert("Please select a single file");

			const file = files[0];

			if (!file.name.endsWith(".json"))
				return alert("Please select a JSON file");

			const session: SessionState = JSON.parse(await file.text());

			this.$store.commit("session", session);
			this.name = session.name;
			requestAnimationFrame(() => {
				this.upToDate = true;
				alert("Profile imported successfully");
			});
		},
		submit() {
			this.$store.commit("session", { name: this.name });
			this.upToDate = true;
			alert("Profile updated");
		},
	},
});

export default Profile;
</script>

<template>
	<div>
		<form @submit.prevent="submit()">
			<fieldset class="grid">
				<legend>Profile</legend>
				<span>
					<label for="name">Name:</label>
					<input id="name" v-model="name" type="text" required />
				</span>
				<span>
					<button type="submit" :disabled="upToDate">✅ Update</button>
				</span>
			</fieldset>
		</form>
		<ul class="unstyled grid">
			<li>
				<button @click="exportSession()">💾 Export</button>
			</li>
			<li>
				<button @click="importSession()">📥 Import</button>
				<input
					ref="file"
					accept="application/json"
					class="no"
					multiple
					type="file"
					@change="loadFile()"
				/>
			</li>
		</ul>
	</div>
</template>

<style lang="less" scoped>
@import "../../styles/breakpoints.less";

ul.unstyled {
	margin-top: var(--space-l);
}

ul li {
	grid-area: 1 / span 2;
}

li button {
	width: 100%;
}

@media @breakpoint_m {
	fieldset.grid > span {
		grid-area: 1 / span 2;
	}
}
</style>
