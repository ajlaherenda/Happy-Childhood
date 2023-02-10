// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/* HappyChildhood contract has been deployed to Goerli 
   at address 0xfB4D111245Aa6F5aEd5E856a51e3cdCEaDE2C7b2
   2nd time 0x2238617C6a256ed1b0EDF991d6Be9fD17cc32B5e
*/

contract HappyChildhood {

    //Event to emit when a Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    // List of all memos recived from funders.
    Memo [] memos;

    // Address of contract deployer.
    address payable owner;
 
    // Deployment logic.
    constructor () {
        owner = payable(msg.sender);
    }

    /**
     * @dev donate to the owner of the contract (organization)
     * @param _name name of the person who donated/donor
     * @param _message message from the donor
     */
    function supportHappyChildhood(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Donations cannot be 0 GOR.");

        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));
        
        // Emit a new event when a memo is created.
        emit NewMemo(
            msg.sender,
            block.timestamp, 
            _name, 
            _message);
    }

     /**
     * @dev send entire balance of contract to the owner of its
     */
    function withdrawDonations () public {
       require(owner.send(address(this).balance));
    }

     /*
     * @dev retrieve all memos recieved and stored on the blockchain
     */
    function getMemos () public view returns(Memo[] memory) {   
       return memos;
    }

    
    


}
