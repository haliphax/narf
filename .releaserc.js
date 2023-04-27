module.exports = {
	branches: ["master"],
	failComment: false,
	plugins: [
		["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
		"@semantic-release/npm",
		[
			"@semantic-release/git",
			{
				assets: ["CHANGELOG.md", "package.json"],
				message: "🔖 release ${nextRelease.version}",
			},
		],
		"@semantic-release/github",
		"semantic-release-gitmoji",
	],
	successComment: false,
};
