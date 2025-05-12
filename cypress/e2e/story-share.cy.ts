describe("story share spec", () => {
	it("copies room URL to clipboard", () => {
		cy.visit("http://localhost:3000", {})
			.get("#title")
			.should("be.visible")
			.type("Share test{enter}")
			.location()
			.should("match", /\/[%a-zA-Z0-9]+/)
			.location()
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
