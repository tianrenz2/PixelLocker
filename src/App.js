import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import ipfs from './ipfs';

import { Itemlist } from './Itemlist';
import Popup from "reactjs-popup";

import web3 from './web3';
import photoArtifact from './Phototrade';

import TruffleContract from 'truffle-contract'
import { Button } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    //State stores basic global data
    this.state = {
      buffer:'',
      account: 0x0,
      balance:0,
      title:'',
      description:'',
      price:0,
      photoinstance: null,
      base_ipfs_url:"https://gateway.ipfs.io/ipfs/"
    }

    //Attaching child reference so that this class can call child's functions
    this.child = React.createRef();
    // this.getAccoundInfo = this.getAccoundInfo.bind(this)

    //Bind the functions in this class so they can be called globally
    this.reloadItem = this.reloadItem.bind(this);
    this.getAccount = this.getAccount.bind(this);
    this.updateInputPrice = this.updateInputPrice.bind(this);
    this.updateInputTitle = this.updateInputTitle.bind(this);
    this.updateInputDes = this.updateInputDes.bind(this);
    this.getAccount();
    this.initContract().then(function(){
      this.reloadItem()
    }.bind(this))

    // this.getBalance = this.getBalance.bind(this)
  }

//File uploading processing
  capTureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  };

  convertToBuffer = async(reader) => {
   //file is converted to a buffer for upload to IPFS
     const buffer = await Buffer.from(reader.result);
     console.log("buffer");
   //set this buffer -using es6 syntax
     this.setState({buffer});
 };

// Get account information from Metamask
getAccount = async() => {
   web3.eth.getCoinbase(function(err, account) {
    if(err === null) {
      this.setState({account:account})
      console.log("Getting Coinbase " + account);
      web3.eth.getBalance(account, function(err, balance) {
        console.log("Getting Balance " + balance);
        if(err === null) {
          console.log("Account Balance:" + balance);
          this.setState({balance:web3.utils.fromWei(balance, "ether")})
        }else {
          console.log("Account Balance 2 Err:" + err);
        }
      }.bind(this))
    }else{
      console.log("Account Balance 1 Err:" + err);
    }
}.bind(this));

}

//Initialize the smart contract
  initContract= async()=>{
    var photoinstance = TruffleContract(photoArtifact)
    await photoinstance.setProvider(web3.currentProvider)
    await this.setState({photoinstance: photoinstance})
  }

//Reloading data from the ethereum
 reloadItem (){
   console.log("Reloading Items");
    this.getAccount();
    var photoworldInstance = null
    // console.log(photoinstance.items)
    this.state.photoinstance.deployed().then(function(instance){
      photoworldInstance = instance
      return photoworldInstance.getNumberOfItems().then(function(data){
        //Get the data of item list as an array, then iterate it to put photographs into the layout
        for (var i= 1; i<=data.toNumber(); i++){
          photoworldInstance.items(i).then(function(item){
            console.log("Loading items: " + item);
            this.child.current.addItem(item[0].toNumber(),item[3], item[4],this.state.base_ipfs_url + item[5],web3.utils.fromWei(item[6].toString()), item[1]);
          }.bind(this))
        }
        //Pass the variables into child class, so he can also reference them.
        this.child.current.bindSellerInfo(photoworldInstance, this.state.account, this.state.balance);
      }.bind(this))
    }.bind(this))
 }


//Sell an item, calling ethereum API
 sellItem(title, description, imghash,price){
   var photoworldInstance = null
   // console.log(photoinstance.items)
   this.state.photoinstance.deployed().then(function(instance){
     photoworldInstance = instance
     return instance.sellItem(title, description, imghash, price);
   }.bind(this))
 }

//Submit new item and write it to block chain
  onSubmit = async (event) => {
      event.preventDefault();
     //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();

      console.log('Sending from Metamask account: ' + this.state.account);

    //save document to IPFS,return its hash, and set hash to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
      await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        //Wait for the file is uploaded onto IPFS
        console.log("Image hash: " + ipfsHash[0].hash);

        //setState by setting ipfsHash to ipfsHash[0].hash
        this.setState({ ipfsHash:ipfsHash[0].hash });

        this.state.photoinstance.deployed().then(function(instance){
          return instance.sellItem(this.state.title,
            this.state.description,
            ipfsHash[0].hash,
            window.web3.toWei(this.state.price),
            {from: this.state.account}).then(function(receipt){
              //Call addItem function in the child itemlist.js, (id,title,description,imagehash,price, account)
              console.log("Published Successfully: " + receipt);
              console.log("Your Image Address: " + "https://gateway.ipfs.io/ipfs/"+ipfsHash[0].hash);
              this.child.current.addItem(receipt.logs[0].args._id.toNumber(), this.state.title, this.state.description, "https://gateway.ipfs.io/ipfs/"+ipfsHash[0].hash,this.state.price, this.state.account)
            }.bind(this))
        }.bind(this)).then(function(result){
          console.log(result);
        }).catch(function(err) {
          console.error(err);
        });
      }); //await ipfs.add
}; //onSubmit


//Listening on price input
  updateInputPrice(evt) {
    console.log(evt.target.value);
    this.setState({
      price: evt.target.value
    });
  }

  //Listening on title input
  updateInputTitle(evt) {
    console.log(evt.target.value);
    this.setState({
      title: evt.target.value
    });
  }

  //Listening on description input
  updateInputDes(evt) {
    console.log(evt.target.value);
    this.setState({
      description: evt.target.value
    });
  }

  render() {
    return (
        <div className="App">
        <button onClick = {this.reloadItem}> reload </button>
        <h5 id="acc">My Id {this.state.account}</h5>
        <h1>My Pocket: {this.state.balance} ETH</h1>
        <Popup
            className = "popup"
            trigger={<button className="basicButton post">Post My Photograph</button>}
            modal
            closeOnDocumentClick>
              <h2 className="postTitle"> Post My Photograph </h2>
              <form>

              <div>
                <label>
                  <h3 className="postInput">Title: <input  onChange={this.updateInputTitle} type="text" name="name" /></h3>
                </label>
              </div>

              <div>
                <label>
                  <h3 className="postInput">Description: <input  onChange={this.updateInputDes} type="text" name="name" /> </h3>
                </label>
              </div>

              <div>
                <label>
                  <h3 className="postInput">Price: <input  onChange={this.updateInputPrice} type="text" name="name"/></h3>
                </label>
              </div>

              <input type = "file" onChange = {this.capTureFile}/>
              <button class="basicButton post" onClick = {this.onSubmit} >Yes</button>
            </form>
      <Itemlist ref={this.child}/>
        </div>
      );
  }


}

export default App;
