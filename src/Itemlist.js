import React, { Component } from 'react';
import { Item } from './Item';
import logo from './pic/pic1.jpg';


class Itemlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [

            ],
        }
    }

    add = (_title, _description,_imghash, _price) => {
      console.log(_imghash);
      this.setState({
        items: this.state.items.concat({
        title: _title,
        description: _description,
        price: _price,
        imghash: _imghash
      })
      });
    }

    render() {
      let data = this.state.items;
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
        // <div>
        // {
          data.map(function(d, idx){
           return (
             <div>
             <h1>
                Title:{d.title}  Price:{d.price}  Description:{d.description}
              </h1>
              <img src={d.imghash} width="200" alt="boohoo" className="img-responsive"/>
              <button onClick=""> Buy </button>
             </div>
           )
         })
       // }
       //  </div>
      );
    }
}

export { Itemlist };
