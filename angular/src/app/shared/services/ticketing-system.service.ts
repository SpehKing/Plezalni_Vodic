import { Injectable} from '@angular/core';
import { Web3 } from "web3";
import { Contract } from "web3-eth-contract";
import { environment } from 'src/environments/environment';
declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class TicketingSystemService {
  public userAddress!: string;
  private web3!: any;
  private contract!: Contract<any>;
//   private contractAddress: string = '0xB6932ab0970FE611b647f0ee07449b8d08bA2FdA'; // Replace with your actual contract address
//   private contractUrl: string = 'http://localhost:3000/ABI/TicketingSystem.json';
//   private contractAbi!: any[]; // Declare contractAbi without initialization

  constructor(){}

  public async connectToBC(): Promise<string> {
    let message = "";
    try {
      // Check if MetaMask is installed
      if (!window.ethereum?.isMetaMask)
        throw new Error("Please install MetaMask wallet!");
      // Check if MetaMask is connected and get the user address
      this.userAddress = (
        await window.ethereum.request({
          method: "eth_requestAccounts",
        })
      )[0];
      // Check the chain ID
      if (
        Web3.utils.toDecimal(
          await window.ethereum.request({ method: "eth_chainId" })
        ) !== environment.allowedChainId
      )
        throw new Error("Chain not allowed, please reconnect MetaMask wallet!");
      // Connect to the blockchain
      this.web3 = new Web3(window.ethereum);
      // Get the contract
      this.contract = new this.web3.eth.Contract(
        (await (await fetch(environment.contractUrl)).json()).abi,
        environment.contractAddress
      );
    } catch (error: any) {
      console.log(error);
      message = error.message;
    }
    return message;
  }


  async createEventOnBC(
      name: string,
      price: number,
      maxParticipants: number,
      eventDBId: string
  ): Promise<void> {
    try {
        // Ensure the connection is established before proceeding
        if (!this.contract) {
          const connectionMessage = await this.connectToBC();
          if (connectionMessage) {
            console.error("Error connecting to blockchain:", connectionMessage);
            return;
          }
        }
        await (this.contract.methods['createEvent'] as any)(
          name,
          price,
          maxParticipants,
          eventDBId
        ).send({ from: this.userAddress });
      } catch (error) {
        console.error("Error creating event on blockchain:", error);
      }
  }

  async findEventIdBC(eventIdDB: string): Promise<string | null> {
    try {
      // Ensure the connection is established before proceeding
      if (!this.contract) {
        const connectionMessage = await this.connectToBC();
        if (connectionMessage) {
          console.error("Error connecting to blockchain:", connectionMessage);
          return null;
        }
      }
  
      // Call the smart contract method to get the corresponding eventIdBC
      const eventIdBC = await (this.contract.methods['getEventIdBC'] as any )(eventIdDB).call();
      return eventIdBC;
    } catch (error) {
      console.error("Error finding eventIdBC:", error);
      return null;
    }
  }

  async purchaseTicket(eventIdDB: string): Promise<void> {

    const eventId = await this.findEventIdBC(eventIdDB);
    const ticketPriceInWei = await (this.contract.methods['getTicketPrice']as any)(eventId).call();

    await (this.contract.methods['purchaseTicket'] as any)(eventId)
       .send({ from: this.userAddress, value: ticketPriceInWei });
  }

  async getEvents(): Promise<string[]> {
    return await this.contract.methods['getEvents']().call();
  }

  async withdrawFunds(eventIdDB: string): Promise<void> {
    const eventId = await this.findEventIdBC(eventIdDB);
    try {
      // Ensure the connection is established before proceeding
      if (!this.contract) {
        const connectionMessage = await this.connectToBC();
        if (connectionMessage) {
          console.error(
            'Error connecting to blockchain:',
            connectionMessage
          );
          return;
        }
      }

      await (this.contract.methods['withdrawFunds'] as any)(eventId).send({
        from: this.userAddress,
      });
    } catch (error) {
      console.error('Error withdrawing funds from blockchain:', error);
    }
  }

  async getEventFunds(eventIdDB: string): Promise<number | null> {
    try {
      if (!this.contract) {
        const connectionMessage = await this.connectToBC();
        if (connectionMessage) {
          console.error("Error connecting to blockchain:", connectionMessage);
          return null;
        }
      }
      const eventIdBC = await this.findEventIdBC(eventIdDB);
      const funds = await (this.contract.methods['getEventFunds'] as any)(eventIdBC).call();
      const fundsInEther = this.web3.utils.fromWei(funds, 'ether');
  
      return parseFloat(fundsInEther);
    } catch (error) {
      console.error("Error getting event funds:", error);
      return null;
    }
  }
  
}
