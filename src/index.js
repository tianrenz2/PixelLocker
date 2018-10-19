import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// import { Web3Provider } from 'react-web3';

ReactDOM.render(
  <App />, document.getElementById('root'));
registerServiceWorker();
<div id="wrapper">
  <div class="container">
    <div class="row">
      <article class="col-md-12">
        <h1 class="text-center">Simple List in React</h1>
        <h2 class="text-center">Adding a dynamically generated list item</h2>
        <div id="app" class="app-container">
        </div>
      </article>
    </div>
  </div>
</div>
