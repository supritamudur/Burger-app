import React from 'react';
//import { withRouter } from 'react-router-dom';

import classes from './Burger.css';
import BurgerIngradient from '../../components/Burger/BurgerIngradient/BurgerIngradient';

const burger = (props) => {
  let transformedIngradients = Object.keys(props.ingradients)
    .map(igKey => {
      return [...Array(props.ingradients[igKey])].map((_, i) => {
        return <BurgerIngradient key={igKey + i} type={igKey} />;
      });
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);
  if (transformedIngradients.length === 0) {
    transformedIngradients = <p>Please start adding ingredients!</p>;
  }
  return (
    <div className={classes.Burger}>
      <BurgerIngradient type="bread-top" />
      {transformedIngradients}
      <BurgerIngradient type="bread-bottom" />
    </div>
  );
};

//export default withRouter(burger);
export default burger;