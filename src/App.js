import React, { Component } from 'react';
import './App.css';
import {ethers} from "ethers";
import abi from "./abi";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status: "",
      mission: "false"
    };
  }

  contractAddress = "0x10903536b7bFdd08a82c8FFDECC92b0F19Bff7cb";

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window["ethereum"]);
    const accounts = await provider.send("eth_requestAccounts", []);

    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);

    const marketplaceContract = new ethers.Contract(this.contractAddress, abi, provider);
    marketplaceContract.on("MissionComplete", (status) => {
        console.log("status", status);
        this.setState({...this.state, mission: "true"});
    })
    marketplaceContract.on("payableStatus", (status) => {
        console.log("status", status);
        this.setState({...this.state, status: status});
    });

    this.setState({...this.state, selectedAddress: accounts[0], balance: balanceInEther});
  }

  async Shipped() {
    const provider = new ethers.providers.Web3Provider(window["ethereum"]);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(accounts[0]);
    const marketplaceContract = new ethers.Contract(this.contractAddress, abi, signer);
    const tx = await marketplaceContract.Shipped({from: accounts[0]});
    this.setState({...this.state, status: "shipped"});
  }

  async Delivered() {
    const provider = new ethers.providers.Web3Provider(window["ethereum"]);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(accounts[0]);
    const marketplaceContract = new ethers.Contract(this.contractAddress, abi, signer);
    const tx = await marketplaceContract.Delivered({from: accounts[0]});
    this.setState({...this.state, status: "delivered"});
  }

  async Status() {
    const provider = new ethers.providers.Web3Provider(window["ethereum"]);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(accounts[0]);
    const marketplaceContract = new ethers.Contract(this.contractAddress, abi, signer);
    await marketplaceContract.Status({value: ethers.utils.parseEther("0.05"), from: accounts[0]});
    console.log("send value to status");
  }

  async GetStatus() {
    const provider = new ethers.providers.Web3Provider(window["ethereum"])
    const accounts = await provider.send("eth_requestAccounts", []);
    provider.getSigner(accounts[0]);
    const marketplaceContract = new ethers.Contract(this.contractAddress, abi, provider);
    const tx = await marketplaceContract.getStatus({from: accounts[0]})
    console.log(tx)
    this.setState({...this.state, status: tx})
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
          <button onClick={() => this.connectToMetamask()}>Connect to Metamask</button>
      )
    } else {
      return (
          <div>
            <p>Welcome {this.state.selectedAddress}</p>
            <p>Your MATIC Balance is: {this.state.balance}</p>
            <button onClick={() => {this.Delivered()}}>delivered</button>
            <button onClick={() => {this.Shipped()}}>shipped</button>
            <button onClick={() => {this.GetStatus()}}>status</button>
            <button onClick={() => {this.Status()}}>pay status</button>
            <span>status : {this.state.status}</span>
            <span>mission complete : {this.state.mission}</span>
          </div>
      );
    }
  }

  render() {
    return (
        <div className="App">
          {this.renderMetamask()}
        </div>
    );
  }

}

export default App;
