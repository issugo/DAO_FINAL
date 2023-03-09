// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract MarketPlace {

    address owner;
    modifier onlyOwner {
      require(msg.sender == owner);
      _;
    }

    address customer;
    modifier onlyCustomer {
      require(msg.sender == customer);
      _;
    }

    enum ShippingStatus {Pending, Shipped, Delivered}
    ShippingStatus status;

    event MissionComplete(string status);
    event payableStatus(string status);

    constructor() {
      status = ShippingStatus.Pending;
      owner = msg.sender;
      customer = msg.sender;
    }

    function Shipped() public onlyOwner {
        status = ShippingStatus.Shipped;
    }

    function Delivered() public onlyOwner {
        status = ShippingStatus.Delivered;
        emit MissionComplete("delivered");
    }

    function getStatus() public onlyOwner view returns(string memory) {
        string memory returnValue = "";
        if(status == ShippingStatus.Pending) {
            returnValue = "Pending";
        } else if (status == ShippingStatus.Shipped) {
            returnValue = "Shipped";
        } else if (status == ShippingStatus.Delivered) {
            returnValue = "Delivered";
        }
        return returnValue;
    }

    function Status() public payable {
        require(msg.value == 0.05 ether, "Insufficient ether to get status");
        string memory returnValue = "";
        if(status == ShippingStatus.Pending) {
            returnValue = "Pending";
        } else if (status == ShippingStatus.Shipped) {
            returnValue = "Shipped";
        } else if (status == ShippingStatus.Delivered) {
            returnValue = "Delivered";
        }
        emit payableStatus(returnValue);
    }
}