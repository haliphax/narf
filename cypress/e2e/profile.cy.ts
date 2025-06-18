describe("user profile", () => {
	it("processes updates", () => {
		cy.visit("http://localhost:3000", {})
			.get("details[open]")
			.get("#name")
			.should("be.visible")
			.clear()
			.type("Custom Username{enter}")
			.get("button")
			.filter((_, v) => v.textContent.includes("Update"))
			.should("be.disabled")
			.reload()
			.get("details")
			.should("not.have.a.property", "open")
			.get("#name")
			.should("have.value", "Custom Username");
	});
});
