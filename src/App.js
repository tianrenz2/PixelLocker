import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ipfs from './ipfs';

import { Itemlist } from './Itemlist';
import Popup from "reactjs-popup";

import web3 from './web3';
import photoArtifact from './Phototrade';

import TruffleContract from 'truffle-contract'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer:'',
      account: 0x0,
      balance:0,
      title:'',
      description:'',
      price:0,
      photoinstance: null
    }
    // console.log(photocontract);
    this.child = React.createRef();
    // this.getAccoundInfo = this.getAccoundInfo.bind(this)
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

 getAccount = async() => {
   web3.eth.getCoinbase(function(err, account) {
    if(err === null) {
      this.setState({account:account})
      console.log(account);
      web3.eth.getBalance(account, function(err, balance) {
        if(err === null) {
          console.log(balance);
          this.setState({balance:web3.utils.fromWei(balance, "ether")})
        }
      }.bind(this))
  }
}.bind(this));

}

  initContract= async()=>{
    var photoinstance = TruffleContract(photoArtifact)
    await photoinstance.setProvider(web3.currentProvider)
    await this.setState({photoinstance: photoinstance})
  }


 reloadItem (){
    this.getAccount();
    var photoworldInstance = null
    // console.log(photoinstance.items)
    this.state.photoinstance.deployed().then(function(instance){
      photoworldInstance = instance
      return photoworldInstance.getNumberOfItems().then(function(data){
        console.log(data.toNumber());
        for (var i= 1; i<=data.toNumber(); i++){
          photoworldInstance.items(i).then(function(item){
            console.log(item);
            this.child.current.add(item[2],item[3],item[4],window.web3.fromWei(item[5].toNumber()))
          }.bind(this))
        }
      }.bind(this))
    }.bind(this))
 }

 sellItem(title, description, imghash,price){
   var photoworldInstance = null
   // console.log(photoinstance.items)
   this.state.photoinstance.deployed().then(function(instance){
     photoworldInstance = instance
     return instance.sellItem(title, description, imghash, price);
   }.bind(this))
 }


  onClick = () => {
    this.child.current.add("hashhash")
  };

  onSubmit = async (event) => {
      event.preventDefault();
     //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();

      console.log('Sending from Metamask account: ' + this.state.account);

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
      await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        console.log(ipfsHash[0].hash);

        //setState by setting ipfsHash to ipfsHash[0].hash
        this.setState({ ipfsHash:ipfsHash[0].hash });

        this.state.photoinstance.deployed().then(function(instance){
          this.child.current.add(this.state.title, this.state.description, "https://gateway.ipfs.io/ipfs/"+ipfsHash[0].hash,this.state.price)
          return instance.sellItem(this.state.title, this.state.description, ipfsHash[0].hash, window.web3.toWei(this.state.price),{from: this.state.account})

        }.bind(this)).then(function(result){
          console.log(result);
        }).catch(function(err) {
          console.error(err);
        });
      }); //await ipfs.add
}; //onSubmit

  updateInputPrice(evt) {
    console.log(evt.target.value);
    this.setState({
      price: evt.target.value
    });
  }
  updateInputTitle(evt) {
    console.log(evt.target.value);
    this.setState({
      title: evt.target.value
    });
  }
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
          trigger={<button className="button">Post My Photograph</button>}
          modal
          closeOnDocumentClick
          >
          <span> Modal content </span>
          <form>
          <label>
            Title:
            <input  onChange={this.updateInputTitle} type="text" name="name" />
          </label>
          <label>
            Description:
            <input  onChange={this.updateInputDes} type="text" name="name" />
          </label>
          <label>
            Price:
            <input  onChange={this.updateInputPrice} type="text" name="name" />
          </label>
          <input type = "file" onChange = {this.capTureFile}/>
          <button onClick = {this.onSubmit}>Submit</button>
        </form>
          </Popup>
          <Itemlist ref={this.child}/>
        </div>
      );
  }


}

export default App;
