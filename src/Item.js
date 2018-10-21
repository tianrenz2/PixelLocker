// import React, { Component } from 'react';
//
// class Item extends React.Component {
//
//   constructor(props) {
//       super(props);
//       this.state = {
//         item:null
//       }
//   }
//
//   initialize = (_title, _description, _price, _imghash, _itemId) => {
//     this.setState({
//       items: this.state.item({
//         title: _title,
//         description: _description,
//         price: _price,
//         imghash: _imghash,
//         itemId: _itemId
//       })
//     });
//   }
//
//   render() {
//     return (
//       <div>
//          <h1>
//            Title:{this.state.title}  Price:{this.state.price}  Description:{this.state.description}
//          </h1>
//          <img src={this.state.imghash} width="200" alt="boohoo" className="img-responsive"/>
//          <button onClick = {this.buyItem}> Buy </button>
//       </div>
//     );
//   }
//
// }
//
// export { Item };
