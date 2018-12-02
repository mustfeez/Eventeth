pragma solidity ^0.4.4;

contract Hangup {
    /**
     * NOTES
     *
     * "organizer" is the person creating Hangup.
     */

    /**
      * Hangup Events
      */
    event _HangupCreated(uint indexed id);
    event _HangupUpdated(uint indexed id);

    struct HangupPost {
      uint id;
      address organizer;
      string ipfsHash;
    }

    /**
      * Hangups map
      *
      * structure
      * Hangups[organizer][id] => ipfs hash
      *
      * example
      * Hangups[0x123...abc][1] => Qm123...abc
      */
    mapping (uint => HangupPost) Hangups;

    /**
      * Latest sequential Hangup ID
      */
    uint public seqId = 0;

    /**
      * Contract owner
      */
    address owner;

    /**
      * Constructor
      */
    function Hangup() {
        owner = msg.sender;
    }

    /**
      * Change contract owner
      */
    function changeOwner(address newOwner) external {
        if (msg.sender == owner) {
            owner = newOwner;
        }
    }

    /**
      * Create a new Hangup post
      */
    function createHangup(
      string ipfsHash
    ) external {
        address organizer = msg.sender;

        seqId = seqId + 1;
        Hangups[seqId] = HangupPost(seqId, organizer, ipfsHash);

        _HangupCreated(seqId);
    }

    /**
      * Edit ipfs hash of a post
      */
    function editHangup(
        uint id,
        string ipfsHash
    ) external {
        address organizer = msg.sender;

        HangupPost storage Hangup = Hangups[id];
        require(Hangup.organizer == organizer);
        Hangups[id].ipfsHash = ipfsHash;

        _HangupUpdated(id);
    }

    /**
      * Retrieve a Hangup post by ID
      */
    function getHangup(uint id) external constant returns (uint, address, string) {
      HangupPost storage Hangup = Hangups[id];

      return (Hangup.id, Hangup.organizer, Hangup.ipfsHash);
    }
}
