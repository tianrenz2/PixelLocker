var Phototrade = artifacts.require("./Phototrade.sol");

// test suite
contract('Phototrade', function(accounts){
  var photoinstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var buyer2 = accounts[3];

  var itemTitle1 = "item 1";
  var itemDes1 = "des 1";
  var itemPrice1 = 10;
  var imghash1 = "";

  var itemTitle2 = "item 2";
  var itemDes2 = "des 2";
  var itemPrice2 = 5;
  var imghash2 = "";

  var buyitemId1 = 1;
  var newPrice1 = 15;
  var newPrice2 = 20;


//Test selling the first photograph
  it("Sell the first photo", function(){
    return Phototrade.deployed().then(function(instance){
      photoinstance = instance
      return photoinstance.sellItem(
        itemTitle1, itemDes1, imghash1, web3.toWei(itemPrice1,"ether"),
        {from: seller});
    }).then(function(receipt){
      // check event
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "sellItemLog", "event should be sellItemLog");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._title, itemTitle1, "event item name must be " + itemTitle1);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(itemPrice1, "ether"), "event article price must be " + web3.toWei(itemPrice1, "ether"));

      assert.equal(receipt.logs[0].args._numbuyers.toNumber(), 0, "buyers should be 0");

      return photoinstance.getNumberOfItems();
    }).then(function(data){
      assert.equal(data, 1, "Number of items should be 1");
    });
  });

  //Test selling the second photograph
  it("Sell the second photo", function(){
    return photoinstance.sellItem(
      itemTitle2, itemDes2, imghash2, web3.toWei(itemPrice2,"ether"),
      {from: seller}).then(function(receipt){
      // check event
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "sellItemLog", "event should be sellItemLog");
      assert.equal(receipt.logs[0].args._id.toNumber(), 2, "id must be 2");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._title, itemTitle2, "event item name must be " + itemTitle2);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(itemPrice2, "ether"), "event article price must be " + web3.toWei(itemPrice2, "ether"));

      assert.equal(receipt.logs[0].args._numbuyers.toNumber(), 0, "buyers should be 0");

      return photoinstance.getNumberOfItems();
    }).then(function(data){
      assert.equal(data, 2, "Number of items should be 2");
    });
  });

  //Test bidding
    it("Buyer1 proposes a price to item1", function(){
      return photoinstance.proposePrice(
        1, newPrice1, {from: buyer}).then(function(receipt){
        // check event
        assert.equal(receipt.logs.length, 1, "one event should have been triggered");
        assert.equal(receipt.logs[0].event, "proposeItemLog", "event should be proposeItemLog");
        assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
        assert.equal(receipt.logs[0].args._curBuyer, buyer, "event seller must be " + seller);

        assert.equal(receipt.logs[0].args._price.toNumber(), newPrice1, "price should be "+newPrice1);

        return photoinstance.getNumberOfItems();
      }).then(function(data){
        assert.equal(data, 2, "Number of items should be 2");
      });
    });

    //Test bidding
    it("Buyer2 proposes a price for item2", function(){
      return photoinstance.proposePrice(
        2, newPrice2, {from: buyer2}).then(function(receipt){
        // check event
        assert.equal(receipt.logs.length, 1, "one event should have been triggered");
        assert.equal(receipt.logs[0].event, "proposeItemLog", "event should be proposeItemLog");
        assert.equal(receipt.logs[0].args._id.toNumber(), 2, "id must be 2");
        assert.equal(receipt.logs[0].args._curBuyer, buyer2, "event seller must be " + seller);

        assert.equal(receipt.logs[0].args._price.toNumber(), newPrice2, "price should be "+newPrice2);

        return photoinstance.getNumberOfItems();
      }).then(function(data){
        assert.equal(data, 2, "Number of items should be 2");
      });
    });

    // Test Buying
  //
  // it("Buyer 1 buys the first photo", function(){
  //   return photoinstance.buyItem(1,
  //     {from: buyer,
  //    }).then(function(receipt){
  //       assert.equal(receipt.logs.length, 1, "one event should have been triggered");
  //       assert.equal(receipt.logs[0].event, "buyItemLog", "event should be LogBuyItem");
  //       assert.equal(receipt.logs[0].args._id.toNumber(), 1, "artile id should be 1");
  //       assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
  //       assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
  //       assert.equal(receipt.logs[0].args._title, itemTitle1, "event article name must be " + itemTitle1);
  //       assert.equal(receipt.logs[0].args._price.toNumber(), newPrice1, "event article price must be " + web3.toWei(itemPrice1, "ether"));
  //       assert.equal(receipt.logs[0].args._numbuyers.toNumber(), 1, "buyers should be 1");
  //
  //    });
  // })
  //
  //
  // it("Buyer2 buyers item 2", function(){
  //   return photoinstance.buyItem(2,
  //     {from: buyer2
  //    }).then(function(receipt){
  //       assert.equal(receipt.logs.length, 1, "one event should have been triggered");
  //       assert.equal(receipt.logs[0].event, "buyItemLog", "event should be LogBuyItem");
  //       assert.equal(receipt.logs[0].args._id.toNumber(), 2, "artile id should be 1");
  //       assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
  //       assert.equal(receipt.logs[0].args._buyer, buyer2, "event buyer must be " + buyer2);
  //       assert.equal(receipt.logs[0].args._title, itemTitle2, "event article name must be " + itemTitle2);
  //       assert.equal(receipt.logs[0].args._price.toNumber(), newPrice2, "event article price must be " + web3.toWei(itemPrice2, "ether"));
  //       assert.equal(receipt.logs[0].args._numbuyers.toNumber(), 2, "buyers should be 2");
  //       assert.equal(receipt.logs[0].args._status, true, "buyer's status should be true");
  //    });
  // })

});
