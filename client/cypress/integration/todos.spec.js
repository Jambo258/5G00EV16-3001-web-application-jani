/* eslint-disable jest/valid-expect */
/// <reference types="cypress" />

describe("Users todos", () => {
  it("should only allow logged in users to add todo", () => {
    cy.login("james@bond.com", "james12345");

    cy.contains("ADD THINGS TO TODO LIST").click();
    cy.contains("Add todo").should("be.disabled");

    cy.get("#title").type("Pick up groceries");
    cy.contains("Add todo").should("be.enabled").click();
  });

  it("should be possible for a logged in user to see own todo list", () => {


    cy.contains("VIEW TODO LIST").click();
    cy.url().should("include", "/todos");


    cy.get(":nth-child(1) .card > .place-item__info > h2").should(
      "have.text",
      "Pick up groceries"
    );

  });

  it("should be possible for a logged in user to edit own todo", () => {


    cy.contains("Edit").click();
    cy.get("#title").should("have.value", "Pick up groceries");


    cy.get("#title").clear().type("Pick up groceries!");

    cy.contains("Update todo").should("be.enabled");
    cy.contains("Update todo").click();

    cy.url().should("include", "/todos");
  });

  it("should be possible for a logged in user to delete own todo", () => {
    

    cy.contains("Delete").click();
    cy.get("#modal-hook > div").should("be.visible");
    cy.get(".modal__header > h2").should("contain", "Are you sure?");
    cy.get(".modal__content > p").should(
      "contain",
      "Are you sure? Once it's gone, it's gone!"
    );
    cy.contains("Delete").click();

    cy.url().should("include", "/todos");
  });
});
