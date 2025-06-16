describe("story interface", () => {
	it("creates, votes, reveals", () => {
		cy.visit("http://localhost:3000", {})
			.get("#title")
			.should("be.visible")
			.type("Lifecycle test{enter}")
			.location()
			.should("match", /\/[%a-zA-Z0-9]+/)
			.get('button[title="Vote 1"]')
			.click()
			.location()
			.then((l) => {
				cy.clearAllLocalStorage()
					.visit(l.href)
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
			.location()
			.should("match", /\/[%a-zA-Z0-9]+/)
			.then((l) => {
				cy.visit(l.href)
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
						expect(clipped).to.eq(l.href);
					});
			});
	});
});
