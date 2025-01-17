import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import PieChart from "./piechart.vue";

describe("PieChart", () => {
	let pieChart: VueWrapper;
	const data = new Map<string, number>([
		["1", 3],
		["3", 1],
		["☕", 2],
		["❌", 1],
		["2", 1],
	]);

	beforeEach(() => {
		pieChart = mount(PieChart, { props: { data } });
	});

	afterEach(() => {
		pieChart.unmount();
	});

	it("provides a slice for each option in data", () => {
		const slices = pieChart
			.findAll("div")
			.filter((v) => v.classes().includes("🍕"));

		expect(slices.length).toBe(data.size);
	});
});
