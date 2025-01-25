describe("story spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:3000", {})
			.get("#title")
			.should("be.visible")
			.type("Test{enter}")
			.location()
			.should("match", /\/[%a-zA-Z0-9]+/)
			.get('button[title="Vote 1"]')
			.click()
			.location()
			.then((l) => {
				localStorage.clear();
				cy.visit(l.href)
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
});
