// TicketingSystemCreateEventTest.js

const TicketingSystem = artifacts.require("TicketingSystem");
const assert = require("assert");

contract("TicketingSystem - Create Event", (accounts) => {
    let ticketingSystemInstance;
    const owner = accounts[0];

    beforeEach(async () => {
        ticketingSystemInstance = await TicketingSystem.new({ from: owner });
    });

    it("should allow the owner to create an event", async () => {
        await truffleAssert.passes(createEvent(owner), truffleAssert.ErrorType.REVERT, "Error creating event");
        const eventCountBefore = await getEventCount();
        await createEvent(owner);
        const eventCountAfter = await getEventCount();

        assert.equal(eventCountAfter, eventCountBefore + 1, "Event count should increase after creating an event");
    });

    async function createEvent(author) {
        await ticketingSystemInstance.createEvent(true, "Test Event", "", "", "", author, 10, 10, { from: author });
    }

    async function getEventCount() {
        const events = await ticketingSystemInstance.getEvents();
        return events.length;
    }
});
