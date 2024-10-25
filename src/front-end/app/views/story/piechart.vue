<script lang="ts">
import { defineComponent } from "vue";

type slice = {
	key: string;
	percent: number;
	rotation: number;
	votes: number;
};

const isNumber = /^\d+(\.\d+)?$/;

const PieChart = defineComponent({
	props: {
		data: {
			type: Map<string, number>,
			required: true,
		},
	},
	computed: {
		slices() {
			const slices: Array<slice> = [];
			const valIter = this.data.entries();

			let entry: IteratorResult<[string, number]>;
			let total = 0;
			let rotation = 0.0;

			while ((entry = valIter.next())) {
				if (entry.done) break;

				const [key, value] = entry.value;

				total += value;
				slices.push({
					key,
					percent: 0,
					rotation,
					votes: value,
				});
			}

			slices.sort((a, b) => {
				const a1 = isNumber.test(a.key)
					? parseFloat(a.key)
					: Number.MAX_SAFE_INTEGER;
				const b1 = isNumber.test(b.key)
					? parseFloat(b.key)
					: Number.MAX_SAFE_INTEGER;

				return a.votes === b.votes ? a1 - b1 : b.votes - a.votes;
			});

			for (let i = 0; i < slices.length; i++) {
				const s = slices[i];

				s.percent = s.votes / total;
				s.rotation = rotation;
				rotation += 360 * s.percent;
			}

			return slices;
		},
	},
	methods: {
		styles(slice: slice) {
			return [`--p:${slice.percent}`, `--r:${slice.rotation}deg`].join(";");
		},
	},
});

export default PieChart;
</script>

<template>
	<div class="🥧" role="figure">
		<div v-for="(s, idx) in slices" :key="s.key" :style="styles(s)">
			<div :class="`🍕 🌈${idx}`">
				<label>
					<span>{{ s.key }}</span>
				</label>
			</div>
		</div>
	</div>
	<div>
		<h3>Results</h3>
		<table>
			<thead>
				<tr>
					<th>Key</th>
					<th>Value</th>
					<th>Votes</th>
					<th><abbr title="Percentage">%</abbr></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(s, idx) in slices" :key="s.key">
					<td>
						<span
							:id="`🍕🌈${s.key}`"
							:class="`🌈 🌈${idx}`"
							:style="styles(s)"
						>
						</span>
					</td>
					<td>{{ s.key }}</td>
					<td>{{ s.votes }}</td>
					<td>{{ (s.percent * 100).toFixed(2) }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="less" scoped>
@import "../../../styles/breakpoints.less";

label {
	cursor: default;
}

.🥧 {
	aspect-ratio: 1;
	gap: 0;
	isolation: isolate;
	margin: 0;
	padding: 0;
	position: relative;
	z-index: -2;
}

.🥧 > div {
	position: absolute;
	width: 100%;
	z-index: -1;
}

.🍕 {
	aspect-ratio: 1;
	place-content: center;
	position: relative;
	transform: rotate(var(--r));
	top: 0;
}

.🍕::before {
	background-image: conic-gradient(var(--c) calc(var(--p) * 100%), #0000 0);
	background-position: 50%;
	border-radius: 50%;
	content: "";
	display: block;
	inset: 1px;
	position: absolute;
}

.🍕 label {
	-webkit-text-stroke: 1px #000;
	bottom: 1px;
	color: #fff;
	display: block;
	font-size: 2rem;
	height: 100%;
	left: 1px;
	padding: var(--space-l);
	position: absolute;
	right: 1px;
	stroke-width: 1px;
	stroke: 1px #000;
	text-align: center;
	top: 1px;
	transform: rotate(calc(var(--p) * 180deg));
	width: 100%;
}

.🍕 label span {
	display: block;
	transform: rotate(calc(var(--p) * -180deg - var(--r)));
}

table {
	border: solid var(--color-outline);
	border-spacing: 0;
	border-width: 1px 1px 0 0;
	width: 100%;
}

thead {
	background-color: var(--color-fg);
	color: var(--color-fg-secondary);
}

tr:nth-child(2n) {
	background-color: var(--color-bg);
}

th,
td {
	border: solid var(--color-fg);
	border-width: 0 0 1px 1px;
	border-collapse: collapse;
	margin: 0;
	padding: var(--space-s) var(--space-m);
}

tr > td:first-child {
	text-align: center;
}

.🌈 {
	background-color: var(--c);
	border: 1px solid var(--color-outline);
	display: block;
	height: var(--space-l);
	margin: 0 auto;
	width: var(--space-l);
}

.🌈0 {
	--c: #d33682;
}

.🌈1 {
	--c: #6c71c4;
}

.🌈2 {
	--c: #b58900;
}

.🌈3 {
	--c: #cb4b16;
}

.🌈4 {
	--c: #859900;
}

.🌈5 {
	--c: #268bd2;
}

.🌈6 {
	--c: #dc322f;
}

.🌈7 {
	--c: #2aa198;
}

@media @breakpoint_s {
	.🥧 label {
		font-size: 4rem;
	}
}

@media @breakpoint_m {
	.🥧 label {
		font-size: 2rem;
	}
}

@media @breakpoint_l {
	.🥧 label {
		font-size: 3rem;
	}
}
</style>
