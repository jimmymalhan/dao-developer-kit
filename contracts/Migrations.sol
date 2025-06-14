 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.20;

 contract Migrations {
     address public owner = msg.sender;
     uint public last_completed_migration;

     modifier onlyOwner() { require(msg.sender == owner); _; }

     function setCompleted(uint completed) public onlyOwner {
         last_completed_migration = completed;
     }
 }
