import Web3 from 'web3';

// const web3 = new Web3(window.web3.currentProvider);
// const web3 = new Web3.providers.HttpProvider('http://localhost:7545');
// console.log(Web3.givenProvider)
const web3 = new Web3(Web3.givenProvider);
export default web3;
