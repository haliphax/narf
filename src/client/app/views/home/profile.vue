<script lang="ts">
import { SessionState } from "@/client/app/store/types";
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
			const input = this.$refs.file as HTMLInputElement;
			const files = input.files;

			if (!files || files.length === 0) return;

			if (files.length > 1) {
				input.value = "";
				await this.$store.dispatch("alert", {
					text: "Please select a single file",
				});
				return;
			}

			const file = files[0];

			if (!file.name.endsWith(".json")) {
				input.value = "";
				await this.$store.dispatch("alert", {
					text: "Please select a JSON file",
				});
				return;
			}

			try {
				const session: SessionState = JSON.parse(await file.text());

				this.$store.commit("session", session);
				this.name = session.name;
			} catch (ex) {
				await this.$store.dispatch("alert", { text: `Error: ${ex}` });
				return;
			} finally {
				input.value = "";
			}

			this.upToDate = true;
			await this.$store.dispatch("alert", {
				text: "Profile imported successfully",
			});
		},
		submit() {
			this.$store.commit("session", { name: this.name });
			this.upToDate = true;
			this.$store.dispatch("alert", { text: "Profile updated" });
		},
	},
});

export default Profile;
</script>

<template>
	<div>
		<form @submit.prevent="submit()">
			<fieldset class="g">
				<legend>Profile</legend>
				<span>
					<label for="name">Name:</label>
					<input id="name" v-model="name" type="text" required />
				</span>
				<span>
					<button type="submit" :disabled="upToDate">
						<span aria-hidden="true">✅</span>
						Update
					</button>
				</span>
			</fieldset>
		</form>
		<ul class="g x">
			<li>
				<button @click="exportSession()">
					<span aria-hidden="true">💾</span>
					Export
				</button>
			</li>
			<li>
				<button @click="importSession()">
					<span aria-hidden="true">📥</span>
					Import
				</button>
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
@import "@/client/styles/breakpoints.less";

ul.x {
	margin-top: var(--space-l);
}

ul li {
	grid-area: 1 / span 2;
}

li button {
	width: 100%;
}

@media @breakpoint_m {
	fieldset > span {
		grid-area: 1 / span 2;
	}
}
</style>
