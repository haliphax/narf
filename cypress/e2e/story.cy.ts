Cypress.automation("remote:debugger:protocol", {
	command: "Browser.grantPermissions",
	params: {
		permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
		origin: window.location.origin,
	},
});

describe("story interface", () => {
	it("creates, votes, reveals", () => {
		cy.visit("http://localhost:3000", {})
			.get("#title")
			.should("be.visible")
			.type("Lifecycle test{enter}")
			.location("pathname")
			.should("match", /\/[a-zA-Z0-9]+/)
			.get('button[title="Vote 1"]')
			.click()
			.location("href")
			.then((l) => {
				cy.clearAllLocalStorage()
					.visit(l)
					.get('button[title="Vote 2"]')
					.should("be.visible")
					.click()
					.get("span.y")
					.should("be.visible")
					.get("button")
					.filter((_, e) => e.textContent.includes("Reveal"))
					.first()
					.click()
					.get('dialog[open] button[value="OK"]')
					.should("be.visible")
					.click()
					.get(".🥧")
					.should("be.visible")
					.find("> div")
					.should("have.length", 2);
			});
	});

	it("copies room URL to clipboard", () => {
		cy.visit("http://localhost:3000", {})
			.get("#title")
			.should("be.visible")
			.type("Share test{enter}")
			.location("pathname")
			.should("match", /\/[a-zA-Z0-9]+/)
			.location("href")
			.then((l) => {
				cy.visit(l)
					.get("button")
					.filter((_, e) => e.textContent.includes("Share"))
					.should("be.visible")
					.click()
					.get('dialog[open] button[type="submit"]')
					.should("be.visible")
					.click()
					.window()
					.then(async (win) => {
						const clipped = await win.navigator.clipboard.readText();
						expect(clipped).to.eq(l);
					});
			});
	});
});
