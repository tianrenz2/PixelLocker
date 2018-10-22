import React, { Component } from 'react';

import logo from './pic/pic1.jpg';
import web3 from './web3';
import Popup from "reactjs-popup";
import { Button } from 'reactstrap';
import { Provider as AlertProvider } from 'react-alert'

class Itemlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [

            ]
        }
        //Attach the functions to this class reference
        this.buyItem = this.buyItem.bind(this);
        this.addItem = this.addItem.bind(this);
    }

//Append an item to the list
    addItem = (_itemId, _title, _description,_imghash, _price, _seller) => {
      console.log("Image Hashes:" + _imghash);
      this.setState({
        items: this.state.items.concat({
          title: _title,
          description: _description,
          price: _price,
          imghash: _imghash,
          itemId: _itemId,
          seller: _seller
        })
      });
    }

//Get data of ethereum instance and account from parent js
    bindSellerInfo = (photoinstance, account, balance) => {
      this.buyItem = this.buyItem.bind(this);

      this.setState({
        photoinstance: photoinstance,
        account: account,
        balance: balance
      });
      // console.log("bindSellerInfo:" + this.buyItem);
    }

//Buy item
    buyItem = (itemId) => {
      var price = this.state.price;
      console.log(price + ":" + this.state.balance);

      this.state.photoinstance.proposePrice(itemId, web3.utils.toWei(price.toString()), {from: this.state.account}).then(function(data){
        console.log(data);
      })

    }

//Listening to proposed price input
    updateInputProposePrice = (evt) => {
      console.log(evt.target.value);
      this.setState({
        price: evt.target.value
      });
    }

    render() {
      //Get items reference from this.state
      let data = this.state.items;
      // console.log(this.buyItem);
      const ColoredLine = ({ color }) => (
          <hr
              style={{
                  color: color,
                  backgroundColor: color,
                  height: 5
              }}
          />
      );
      return (
        //Iterate the items and adapt them into a listview
          data.map(function(element, idx){
            // console.log(this.buyItem);
            return(
             <div>
             <hr>
             </hr>
                <h1>
                  {element.title}
                </h1><h4> posted by {element.seller}</h4>
                <h2>
                Description: {element.description}
                </h2>
                <p>Price: {element.price} Ether</p>
                <img src={element.imghash} width="300" alt="Image not able to show" className="img-responsive"/>
                <br/>
                <Popup
                    trigger={<button className="basicButton propose">BID</button>}
                    modal
                    closeOnDocumentClick
                    className = "popup"
                >
                <h2 className="postTitle"> I want to bid !</h2>
                  <label>
                  <h3 className="postInput">
                    New Price: <input  onChange={this.updateInputProposePrice} type="text" name="name" /></h3>
                  </label>
                  <button onClick = {this.buyItem.bind(this, element.itemId)}> Propose </button>
                </Popup>

             </div>

           );
         }.bind(this))
      )
    }
  }

export { Itemlist };
