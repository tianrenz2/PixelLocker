import React, { Component } from 'react';

class Item extends React.Component {

    render() {
        return (
            <div><img src={'http://placehold.it/400x20&text=slide1'} alt="boohoo" className="img-responsive"/></div>
        );
    }
    
}

export { Item }
