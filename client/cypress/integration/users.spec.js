/* eslint-disable jest/valid-expect */
/// <reference types="cypress" />

describe("Users page", () => {
  it("should open", () => {
    cy.visit("/");
    cy.contains("Users");
    cy.get("h1.main-navigation__title").should("contain", "Users");
  });

  it("should open authentication form when clicking Authenticate", () => {
    cy.visit("/");
    cy.contains("AUTHENTICATE").click();
    cy.url().should("include", "/auth");

    cy.contains("Login Required");
    cy.contains("Signup instead?").click();
    cy.get('[data-cy="switch-mode"]').should("not.contain", "Signup instead?");
    cy.contains("Login instead?").click();
    cy.get('[data-cy="switch-mode"]').should("not.contain", "Login instead?");
  });

  it("should signup a admin", () => {
    cy.visit("/auth");
    cy.contains("Signup instead?").click();

    cy.get("#name").clear();
    cy.get("#name").type("John Jones");

    cy.get("#email").clear();
    cy.get("#email").type("john@jones.com");

    cy.get("#password").clear();
    cy.get("#password").type("john12345");

    cy.get("#role").clear();
    cy.get("#role").type("admin");

    cy.contains("SIGNUP").click();
  });

  it("should not signup a user with same email", () => {
    cy.visit("/auth");
    cy.contains("Signup instead?").click();

    cy.get("#name").clear();
    cy.get("#name").type("John Jones");

    cy.get("#email").clear();
    cy.get("#email").type("john@jones.com");

    cy.get("#password").clear();
    cy.get("#password").type("john12345");

    cy.get("#role").clear();
    cy.get("#role").type("admin");

    cy.contains("SIGNUP").click();

    cy.get("#modal-hook > div").should("be.visible");
    cy.get(".modal__header > h2").should("contain.text", "An Error Occurred!");
    cy.get(".modal__content > p").should(
      "contain.text",
      "Could not create user, user exist"
    );
    cy.get("h2 > .button").click();
    cy.contains("Okay").click();
  });

  it("should show the signed up users / admins for the admins", () => {
    cy.visit("/auth");
    cy.get("form > .button").should("be.disabled");
    cy.get("#email").type("john@jones.com");
    cy.get("#password").type("john12345");
    cy.get("form > .button").should("be.enabled");
    cy.get("form > .button").click();
    cy.contains("ALL USERS").click();

  });

  it("should not allow an invalid user to login", () => {
    cy.visit("/auth");
    cy.get("form > .button").should("be.disabled");
    cy.get("#email").type("john@jones.com");
    cy.get("#password").type("johnjohn");
    cy.get("form > .button").should("be.enabled");
    cy.get("form > .button").click();
    cy.get("#modal-hook > div").should("be.visible");
    cy.get(".modal__header > h2").should("contain", "An Error Occurred!");
    cy.get(".modal__content > p").should(
      "contain",
      "Could not identify user, credetials might be wrong"
    );
    cy.get("h2 > .button").click();
  });

  it("should allow a valid user to login", () => {
    cy.visit("/auth");
    cy.get("form > .button").should("be.disabled");
    cy.get("#email").type("john@jones.com");
    cy.get("#password").type("john12345");
    cy.get("form > .button").should("be.enabled");
    cy.get("form > .button").click();

  });


  it("should signup a quest", () => {
    cy.visit("/auth");
    cy.contains("Signup instead?").click();

    cy.get("#name").clear();
    cy.get("#name").type("John Wayne");

    cy.get("#email").clear();
    cy.get("#email").type("john@wayne.com");

    cy.get("#password").clear();
    cy.get("#password").type("wayne12345");

    cy.get("#role").clear();
    cy.get("#role").type("quest");

    cy.contains("SIGNUP").click();
  });

  it("should show error modal if user has no todos", () => {

    cy.visit("/auth");
    cy.get("form > .button").should("be.disabled");
    cy.get("#email").type("john@wayne.com");
    cy.get("#password").type("wayne12345");
    cy.get("form > .button").should("be.enabled");
    cy.get("form > .button").click();
    cy.contains("VIEW TODO LIST").click()
    cy.get("#modal-hook > div").should("be.visible");
    cy.get(".modal__header > h2").should("contain", "An Error Occurred!");
    cy.get(".modal__content > p").should(
      "contain",
      "Could not find todos for the provided user id"
    );
    cy.get("h2 > .button").click();
  });

  it("should allow quest to delete own account and force logout", () => {

    cy.visit("/auth");
    cy.get("form > .button").should("be.disabled");
    cy.get("#email").type("john@wayne.com");
    cy.get("#password").type("wayne12345");
    cy.get("form > .button").should("be.enabled");
    cy.get("form > .button").click();
    cy.contains("DELETE ACCOUNT").click();
    cy.contains("Delete").click();
    cy.get("#modal-hook > div").should("be.visible");
    cy.get(".modal__header > h2").should("contain", "Are you sure?");
    cy.get(".modal__content > p").should(
      "contain",
      "Are you sure? Once it's gone, it's gone!"
    );
    cy.contains("Delete").click();
    cy.contains("AUTHENTICATE");

  });

  it("should signup a test quest for admin to test delete", () => {
    cy.visit("/auth");
    cy.contains("Signup instead?").click();

    cy.get("#name").clear();
    cy.get("#name").type("Clint Eastwood");

    cy.get("#email").clear();
    cy.get("#email").type("clint@eastwood.com");

    cy.get("#password").clear();
    cy.get("#password").type("clint12345");

    cy.get("#role").clear();
    cy.get("#role").type("quest");

    cy.contains("SIGNUP").click();
    cy.contains("LOGOUT");
  });

  it("should show the signed up users / admins for admins and delete quest/admin", () => {
    cy.visit("/auth");
    cy.get("form > .button").should("be.disabled");
    cy.get("#email").type("john@jones.com");
    cy.get("#password").type("john12345");
    cy.get("form > .button").should("be.enabled");
    cy.get("form > .button").click();
    cy.contains("ALL USERS").click();
    cy.contains("Clint Eastwood").click()
    cy.contains("Delete").click()
    cy.get("#modal-hook > div").should("be.visible");
    cy.get(".modal__header > h2").should("contain", "Are you sure?");
    cy.get(".modal__content > p").should(
      "contain",
      "Are you sure? Once it's gone, it's gone!"
    );
    cy.contains("Delete").click();
    cy.contains("Clint EastWood").should("not.exist");

  });

  it("should signup a test quest for todotests", () => {
    cy.visit("/auth");
    cy.contains("Signup instead?").click();

    cy.get("#name").clear();
    cy.get("#name").type("James Bond");

    cy.get("#email").clear();
    cy.get("#email").type("james@bond.com");

    cy.get("#password").clear();
    cy.get("#password").type("james12345");

    cy.get("#role").clear();
    cy.get("#role").type("quest");

    cy.contains("SIGNUP").click();
  });
});
