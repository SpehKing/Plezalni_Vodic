const TicketingSystem = artifacts.require("TicketingSystem");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

contract("TicketingSystem", (accounts) => {
    let ticketingSystemInstance;
    const owner = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];

    // Helper function to create an event
    async function createEvent(author, maxParticipants = 10) {
        await ticketingSystemInstance.createEvent("Test Event", 10, maxParticipants, { from: author });
        const events = await ticketingSystemInstance.getEvents();
        return events[0];
    }

    // Helper function to purchase a ticket
    async function purchaseTicket(buyer, eventId, value = 10) {
        await ticketingSystemInstance.purchaseTicket(eventId, { from: buyer, value: value });
    }

    beforeEach(async () => {
        ticketingSystemInstance = await TicketingSystem.new({ from: owner });
    });

    it("should allow the owner to create an event", async () => {
        const eventId = await createEvent(owner);
        const event = await ticketingSystemInstance.events(eventId);

        assert.equal(event.author, owner, "Event author not set correctly");
        assert.equal(event.currentNumParticipants, 0, "Current number of participants should be zero initially");
    });

    it("should allow participants to purchase tickets", async () => {
        const eventId = await createEvent(owner);

        await purchaseTicket(participant1, eventId);
        let participants = await ticketingSystemInstance.getEventParticipants(eventId);
        assert.equal(participants.length, 1, "Incorrect number of participants after the first purchase");
        assert.equal(participants[0], participant1, "Incorrect participant after the first purchase");

        await purchaseTicket(participant2, eventId);
        participants = await ticketingSystemInstance.getEventParticipants(eventId);
        assert.equal(participants.length, 2, "Incorrect number of participants after the second purchase");
        assert.equal(participants[1], participant2, "Incorrect participant after the second purchase");
    });

    it("should not allow purchasing more tickets than the maximum allowed", async () => {
        const maxParticipants = 2;
        const eventId = await createEvent(owner, maxParticipants);

        await purchaseTicket(participant1, eventId);
        await purchaseTicket(participant2, eventId);

        // Try to purchase another ticket, should fail
        await truffleAssert.reverts(
            ticketingSystemInstance.purchaseTicket(eventId, { from: participant1, value: 10 }),
            "Event is sold out"
        );
    });

    it("should return correct ticket price", async () => {
        const eventId = await createEvent(owner);
        const ticketPrice = await ticketingSystemInstance.getTicketPrice(eventId);

        assert.equal(ticketPrice, 10, "Incorrect ticket price");
    });

    it("should not allow purchasing a ticket with incorrect value", async () => {
        const eventId = await createEvent(owner);

        // Try to purchase a ticket with incorrect value, should fail
        await truffleAssert.reverts(
            ticketingSystemInstance.purchaseTicket(eventId, { from: participant1, value: 5 }),
            "Incorrect ticket price"
        );
    });

    it("should not allow purchasing a ticket for a non-existing event", async () => {
        const nonExistingEventId = "0x0000000000000000000000000000000000000001";

        // Try to purchase a ticket for a non-existing event, should fail
        await truffleAssert.reverts(
            ticketingSystemInstance.purchaseTicket(nonExistingEventId, { from: participant1, value: 10 }),
            "Event does not exist"
        );
    });

    it("should allow the event author to withdraw funds", async () => {
        const eventId = await createEvent(owner);
    
        // Purchase tickets to accumulate funds
        await purchaseTicket(participant1, eventId);
        await purchaseTicket(participant2, eventId);
    
        const initialBalance = new web3.utils.BN(await web3.eth.getBalance(owner));
    
        // Withdraw funds
        const tx = await ticketingSystemInstance.withdrawFunds(eventId, { from: owner });
    
        const gasUsed = new web3.utils.BN(tx.receipt.gasUsed);
        const gasPrice = new web3.utils.BN((await web3.eth.getTransaction(tx.tx)).gasPrice);
    
        // Calculate the expected balance considering gas cost
        const expectedBalance = initialBalance.add(new web3.utils.BN(20)).sub(gasUsed.mul(gasPrice));
    
        const finalBalance = new web3.utils.BN(await web3.eth.getBalance(owner));
    
        // Check if the final balance is within a certain range
        const lowerBound = expectedBalance.sub(new web3.utils.BN(1)); // Adjust the range as needed
        const upperBound = expectedBalance.add(new web3.utils.BN(1));
    
        assert.ok(
            finalBalance.gte(lowerBound) && finalBalance.lte(upperBound),
            "Incorrect balance after fund withdrawal"
        );
    });
    
    it("should not allow withdrawal if there are no funds for the event", async () => {
        const eventId = await createEvent(owner);
    
        // Try to withdraw funds when there are no funds, should fail
        await truffleAssert.reverts(
            ticketingSystemInstance.withdrawFunds(eventId, { from: owner }),
            "No funds to withdraw for this event"
        );
    });
    
    it("should not allow non-event author to withdraw funds", async () => {
        const eventId = await createEvent(owner);
    
        // Purchase tickets to accumulate funds
        await purchaseTicket(participant1, eventId);
        await purchaseTicket(participant2, eventId);
    
        // Try to withdraw funds as a non-event author, should fail
        await truffleAssert.reverts(
            ticketingSystemInstance.withdrawFunds(eventId, { from: participant1 }),
            "Only the event author can perform this action"
        );
    });
    
    
    
});
