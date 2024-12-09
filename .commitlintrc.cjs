module.exports = {
	extends: ["gitmoji"],
	parserPreset: "./.commitlintparser.cjs",
	rules: {
		"type-empty": [0, "always"],
	},
};
