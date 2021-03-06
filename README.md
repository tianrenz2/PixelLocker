
## Frontend: React JS:

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## File Storage is powered by [Interplanetary File System(IPFS)](https://ipfs.io/):
[IPFS Github](https://github.com/ipfs/ipfs).

## [MetaMask](https://metamask.io/): a general wallet for DApps
Make sure your MetaMask is on, this is your wallet on this platform.

## Deployment Tool: Truffle

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Download the box. This also takes care of installing the necessary dependencies.
    ```javascript
    truffle unbox chainskills/chainskills-box
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the `liteserver` development server (outside the development console) for front-end hot reloading. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run dev
    ```
## Ehereum Javascript API: [Web3](https://web3js.readthedocs.io/en/1.0/).


## Deployment

For testing it locally, make sure the ganache is running and there are accounts with money in the local network.

In src/ directory, do the following things:

1. Deploy Smart Contracts
    ```javascript
    truffle migrate --compile-all --reset --network ganache
    ```
2. Run React
    ```javascript
    npm start
    ```




