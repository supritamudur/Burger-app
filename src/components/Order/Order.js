import React from 'react';

import classes from './Order.css';

const order = ( props ) => {
    const ingradients = [];

    for ( let ingradientName in props.ingradients ) {
        ingradients.push(
            {
                name: ingradientName,
                amount: props.ingradients[ingradientName]
            }
        );
    }

    const ingradientOutput = ingradients.map(ig => {
        return <span 
            style={{
                textTransform: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
                }}
            key={ig.name}>{ig.name} ({ig.amount})</span>;
    });

    return (
        <div className={classes.Order}>
            <p>Ingradients: {ingradientOutput}</p>
            <p>Price: <strong>USD {Number.parseFloat( props.price ).toFixed( 2 )}</strong></p>
        </div>
    );
};

export default order;