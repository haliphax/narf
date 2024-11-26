<script lang="ts">
import { defineComponent } from "vue";
import { Module } from "vuex";
import { StoreState } from "../store/types";

type DialogsModuleState = object;

const dialogsModule: Module<DialogsModuleState, StoreState> = {
	actions: {
		alert() {},
		close() {},
		confirm() {},
		confirmed() {},
	},
};

const Dialogs = defineComponent({
	data() {
		return {
			responseId: "",
			dialogText: "",
		};
	},
	mounted() {
		if (!this.$store.hasModule("dialogs")) {
			this.$store.registerModule("dialogs", dialogsModule);
		}

		this.$store.subscribeAction((a) => {
			switch (a.type) {
				case "alert": {
					this.responseId = a.payload.id ?? "";
					this.dialogText = a.payload.text;
					(this.$refs.alert as HTMLDialogElement).showModal();
					break;
				}
				case "confirm": {
					this.responseId = a.payload.id;
					this.dialogText = a.payload.text;
					(this.$refs.confirm as HTMLDialogElement).showModal();
					break;
				}
			}
		});

		(this.$refs.alert as HTMLDialogElement).addEventListener(
			"close",
			async () => await this.$store.dispatch("close", this.responseId),
		);
	},
	methods: {
		async confirmed() {
			(this.$refs.confirm as HTMLDialogElement).close("OK");
			await this.$store.dispatch("confirmed", this.responseId);
		},
	},
});

export default Dialogs;
</script>

<template>
	<span>
		<dialog ref="alert">
			<form method="dialog">
				<fieldset>
					<legend>Alert</legend>
					<p>{{ dialogText }}</p>
					<div>
						<button class="fr" type="submit">
							<span aria-hidden="true">✅</span>
							OK
						</button>
					</div>
				</fieldset>
			</form>
		</dialog>
		<dialog ref="confirm">
			<form method="dialog">
				<fieldset>
					<legend>Confirm</legend>
					<p>{{ dialogText }}</p>
					<div>
						<button type="submit" value="Cancel">
							<span aria-hidden="true">🚫</span>
							Cancel
						</button>
						<button class="fr" value="OK" @click.prevent="confirmed">
							<span aria-hidden="true">✅</span>
							OK
						</button>
					</div>
				</fieldset>
			</form>
		</dialog>
	</span>
</template>

<style lang="less" scoped>
dialog {
	background-color: var(--color-bg-global);
	border: 1px solid #000;
	color: var(--color-fg-global);
	margin: auto;
	max-width: 40rem;
	padding: var(--space-l);
	width: 100%;
}

dialog::backdrop {
	backdrop-filter: blur(8px);
	background-color: rgba(0, 0, 0, 0.2);
}
</style>
