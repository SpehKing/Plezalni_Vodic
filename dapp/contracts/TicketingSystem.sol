// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TicketingSystem {
    //address public owner;
    uint256 public eventCounter = 0;
    
    struct Event {
        uint256 id;
        string eventDBId;
        address author;
        string name;
        uint256 price;
        uint256 maxParticipants;
        uint256 currentNumParticipants;
        address[] participants;
    }
    struct EventFunds{
        uint256 eventId;
        uint256 funds;
    }

    //mapping(uint256 => uint256) public fundsReceived; // Mapping to track funds received for each event
    
    Event[] public events;
    EventFunds[] public eventFunds;
    uint256[] public eventIds; // new array to store event IDs
    string[] public eventDBIds; // new array to store event ids from database

    // modifier onlyOwner() {
    //     require(msg.sender == owner, "Only the owner can perform this action");
    //     _;
    // }
    modifier onlyEventAuthor(uint256 eventId) {
    require(msg.sender == events[eventId].author, "Only the event author can perform this action");
    _;
}

    modifier eventExists(uint256 eventId) {
        bool exists = false;
        for (uint256 i = 0; i < eventIds.length; i++) {
            if (eventIds[i] == eventId && events[eventId].author != address(0)) {
                exists = true;
                break;
            }
        }
        require(exists, "Event does not exist");
        _;
    }

    modifier notSoldOut(uint256 eventId) {
        require(events[eventId].currentNumParticipants < events[eventId].maxParticipants, "Event is sold out");
        _;
    }

    modifier notAlreadyPurchased(uint256 eventId) {
        bool purchased = false;
        for (uint256 i = 0; i < events[eventId].participants.length; i++) {
            if (events[eventId].participants[i] == msg.sender) {
                purchased = true;
                break;
            }
        }
        require(!purchased, "You have already purchased a ticket for this event");
        _;
    }

    event TicketPurchased(address indexed buyer, uint256 indexed eventId);

    constructor() {
        //owner = msg.sender;
    }

    function createEvent(
        string memory _name,
        uint256 _price,
        uint256 _maxParticipants,
        string memory _eventDBId
    ) external {
        uint256 eventId = eventCounter++;
        // events[eventId] = Event({
        //     author: msg.sender,
        //     name: _name,
        //     price: _price,
        //     maxParticipants: _maxParticipants,
        //     currentNumParticipants: 0,
        //     participants: new address[](0,
        // });
        Event memory newEvent = Event({
            id: eventId,
            eventDBId: _eventDBId,
            author: msg.sender,
            name: _name,
            price: _price,
            maxParticipants: _maxParticipants,
            currentNumParticipants: 0,
            participants: new address[](0)
        });
        EventFunds memory newEventFunds = EventFunds({
            eventId: eventId,
            funds: 0
        });
        events.push(newEvent);
        //events[eventId] = newEvent;
        eventIds.push(eventId); // Add the event ID to the array
        eventDBIds.push(_eventDBId);
        eventFunds.push(newEventFunds);
    }

    function getEvents() external view returns (uint256[] memory) {
        return eventIds;
    }

    function getEventIdBC(string memory eventIdFromDb) external view returns (int256) {
        for (uint256 i = 0; i < events.length; i++) {
            if (keccak256(abi.encodePacked(events[i].eventDBId)) == keccak256(abi.encodePacked(eventIdFromDb))) {
                return int256(i);
            }
        }
        return -1;
    }

    function purchaseTicket(uint256 eventId) external payable eventExists(eventId) notSoldOut(eventId) notAlreadyPurchased(eventId) {
        require(msg.value == events[eventId].price, "Incorrect ticket price");
        
        events[eventId].participants.push(msg.sender);
        events[eventId].currentNumParticipants++;

        eventFunds[eventId].funds += msg.value;
        emit TicketPurchased(msg.sender, eventId);
    }

    function getEventParticipants(uint256 eventId) external view eventExists(eventId) returns (address[] memory) {
        return events[eventId].participants;
    }

    function withdrawFunds(uint256 eventId) external onlyEventAuthor(eventId) eventExists(eventId) {
        require(eventFunds[eventId].funds > 0, "No funds to withdraw for this event");

        //payable(events[eventId].author).transfer(eventFunds[eventId].funds);
        (bool success, ) = payable(events[eventId].author).call{value: eventFunds[eventId].funds}("");
        require(success, "Failed to send funds to the event author");
        eventFunds[eventId].funds = 0; // Reset funds for the event
    }

    function getTicketPrice(uint256 eventId) external view eventExists(eventId) returns (uint256) {
        return events[eventId].price;
    }
    function getEventFunds(uint256 eventId) external view eventExists(eventId) returns (uint256) {
        return eventFunds[eventId].funds;
    }


}
