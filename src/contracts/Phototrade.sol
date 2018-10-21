pragma solidity ^0.4.18;

import "./Ownable.sol";

contract Phototrade is Ownable {

  struct Item{
    uint id;
    address seller;
    address curBuyer;
    mapping (address => bool) buyers;
    string title;
    string description;
    string imghash;
    uint256 price;
    uint numbuyers;
    uint timeCreate;
  }

  mapping (uint => Item) public items;
  uint itemCounter;

  function getItemsIndex(uint index) returns (uint id, address seller, uint price, uint numbuyers) {
    Item local = items[index];
    return (local.id, local.seller, local.price, local.numbuyers);
  }

  // events
  event sellItemLog(
    uint indexed _id,
    address indexed _seller,
    string _title,
    uint256 _price,
    uint _numbuyers
  );

  event buyItemLog(
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _title,
    uint256 _price,
    uint _numbuyers,
    bool _status
  );

  event proposeItemLog(
    uint indexed _id,
    address indexed _curBuyer,
    uint256 _price
  );


  function sellItem(string _title, string _description, string _imghash, uint256 _price) public{

    itemCounter++;

    items[itemCounter].id = itemCounter;
    items[itemCounter].seller = msg.sender;
    items[itemCounter].title = _title;
    items[itemCounter].description = _description;
    items[itemCounter].imghash = _imghash;
    items[itemCounter].price = _price;
    items[itemCounter].timeCreate = block.timestamp;
    items[itemCounter].numbuyers = 0;
    sellItemLog(itemCounter, msg.sender, _title, _price, 0);
  }


  function proposePrice(uint _id, uint _proPrice) payable public{

    items[_id].price = _proPrice;
    items[_id].curBuyer = msg.sender;
    proposeItemLog(_id, items[_id].curBuyer, items[_id].price);
  }


  function buyItem(uint _id) payable public{
    Item storage item = items[_id];
    item.buyers[msg.sender] = true;

    item.seller.transfer(item.price);

    item.numbuyers++;
    buyItemLog(item.id, item.seller, item.curBuyer, item.title, item.price, item.numbuyers, item.buyers[msg.sender]);
  }

  function getNumberOfItems() public view returns(uint){
    return itemCounter;
  }
/*
  function getItemsforSale() public constant returns(uint id){

    uint[] memory forSale = new uint[](itemCounter+1);
    for(uint j = 1; j<=itemCounter; j++){
      forSale[j] = items[j];
    }

    return forSale;
  }
*/
  function getNumberOfBuyers(uint _id) public constant returns(uint id){
    return items[_id].numbuyers;
  }

}
