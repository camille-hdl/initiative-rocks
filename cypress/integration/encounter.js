/* eslint-disable */

describe('Encounter', function () {
    beforeEach(() => {
        if (window.navigator && navigator.serviceWorker) {
          navigator.serviceWorker.getRegistrations()
          .then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister()
            })
          })
        }
      })
    it("Add a creature to the encounter, deal damage", function () {
        
        cy.visit('/');
        cy.get("h1").should("contain", "Initiative Rocks!");
        cy.get("[data-cy=welcome-message]").should("exist");

        cy.get("[data-cy=add-creature-fab").click();
        cy.get("[data-cy=welcome-message]").should("not.exist");
        cy.get("[data-cy=creature]").find("[data-cy=creature-form]");
        cy.get("[data-cy=creature-name]").find("input[type=text]").clear().type("My creature1").should("have.value", "My creature1");
        cy.get("[data-cy=creature-init]").find("input[type=number]").clear().type("17").should("have.value", "17");
        cy.get("[data-cy=creature-max-hp]").find("input[type=number]").clear().type("50").should("have.value", "50");
        cy.get("[data-cy=creature-name-display]").should("contain", "My creature1");
        cy.get("[data-cy=creature-name-display]").click();
        cy.get("[data-cy=creature-name]").should("not.be.visible");
        cy.get("[data-cy=creature-hp-display]").should("exist");
        cy.get("[data-cy=creature-hp-display]").should("contain", "50 / 50");
        cy.get("[data-cy=hp-manager-toggle]").click();
        cy.get("[data-cy=hp-manager-modal]").should("be.visible");
        cy.get("[data-cy=hp-manager-input]").find("input").clear().type("10+(10/2)-1").should("have.value", "10+(10/2)-1");
        cy.get("[data-cy=hp-manager-amount]").should("contain", "14");
        cy.get("[data-cy=hp-manager-damage]").click();
        cy.get("[data-cy=hp-manager-modal]").should("not.be.visible");
        cy.get("[data-cy=creature-hp-display]").should("contain", "36 / 50");
    });

    it("Add 2 creatures to the encounter, advance rounds", function () {
        
        cy.visit('/');

        cy.get("[data-cy=add-creature-fab").click();
        cy.get("[data-cy=creature]").find("[data-cy=creature-form]");
        cy.get("[data-cy=creature-name]").find("input[type=text]").clear().type("My creature1").should("have.value", "My creature1");
        cy.get("[data-cy=creature-init]").find("input[type=number]").clear().type("17").should("have.value", "17");
        cy.get("[data-cy=creature-max-hp]").find("input[type=number]").clear().type("50").should("have.value", "50");
        cy.get("[data-cy=creature-name-display]").click();
        cy.get("[data-cy=creature-name]").should("not.be.visible");

        cy.get("[data-cy=add-creature-fab").click();
        cy.get("[data-cy=creature-name]").last().find("input[type=text]").clear().type("My creature2").should("have.value", "My creature2");
        cy.get("[data-cy=creature-init]").last().find("input[type=number]").clear().type("20").should("have.value", "20");

        // turn order should have changed
        cy.get("[data-cy=creature-name-display]").first().should("contain", "My creature2");

        cy.get("[data-cy=reset-rounds-btn]").should("contain", "1");
        cy.get("[data-cy=nex-turn-fab]").click().click();
        cy.get("[data-cy=reset-rounds-btn]").should("contain", "2");
        cy.get("[data-cy=reset-rounds-btn]").click();
        cy.get("[data-cy=reset-rounds-btn]").should("contain", "1");
    });

    it("Display left drawer, save creature, remove then re-add it", function () {
        cy.visit('/');
        cy.get("[data-cy=settings-theme]").should("not.be.visible");
        cy.get("[data-cy=toggle-drawer-btn]").click();
        cy.get("[data-cy=settings-theme]").should("be.visible");

        cy.get("[data-cy=saved-creatures-list]").should("contain", "Nothing here");
        // FIXME: can't close the drawer in cypress because classes are changing every time...
        // cy.get("body").type("{esc}");
        // cy.get("[data-cy=settings-theme]").should("not.be.visible");

        // cy.get("[data-cy=add-creature-fab]").click();
        // cy.get("[data-cy=creature-name]").find("input[type=text]").clear().type("My creature1");
        // cy.get("[data-cy=save-creature-btn]").click();
        // cy.get("[data-cy=delete-creature-btn]").click();
        // cy.get("[data-cy=welcome-message]").should("exist");

        // cy.get("[data-cy=toggle-drawer-btn]").click();
        // cy.get("[data-cy=saved-creatures-list]").should("contain", "My creature1");
        // cy.get("[data-cy=saved-creatures-list]").find("[role=button]").first().click();
        // cy.get("body").type("{esc}");
        // cy.get("[data-cy=welcome-message]").should("not.exist");
    });
});