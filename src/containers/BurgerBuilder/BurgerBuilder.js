import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGRADIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingradients: {
     salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: true
    }
    

    componentDidMount () {
        console.log(this.props);
        axios.get( 'https://react-my-burger-c63d3.firebaseio.com/ingradients.json')
            .then( response => {
                this.setState( { ingradient: response.data } );
            } )
            .catch( _error => {
                this.setState( { _error: true } );
            } );
    }

    updatePurchaseState ( ingradients ) {
        const sum = Object.keys( ingradients )
            .map( igKey => {
                return ingradients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        this.setState( { purchasable: sum > 0 } );
    }

    addIngradientHandler = ( type ) => {
        const oldCount = this.state.ingradients[type];
        const updatedCount = oldCount + 1;
        const updatedIngradients = {
            ...this.state.ingradients
        };
        updatedIngradients[type] = updatedCount;
        const priceAddition = INGRADIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, ingradients: updatedIngradients } );
        this.updatePurchaseState( updatedIngradients );
    }

    removeIngradientHandler = ( type ) => {
        const oldCount = this.state.ingradients[type];
        if ( oldCount <= 0 ) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngradients = {
            ...this.state.ingredients
        };
        updatedIngradients[type] = updatedCount;
        const priceDeduction = INGRADIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, ingradients: updatedIngradients } );
        this.updatePurchaseState( updatedIngradients );
    }

    purchaseHandler = () => {
        this.setState( { purchasing: true } );
    }

    purchaseCancelHandler = () => {
        this.setState( { purchasing: false } );
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        
        const queryParams = [];
        for (let i in this.state.ingradients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingradients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render () {
        const disabledInfo = {
            ...this.state.ingradients
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingradients can't be loaded!</p> : <Spinner />;

        if ( this.state.ingradients ) {
            burger = (
                <Aux>
                    <Burger ingradients={this.state.ingradients} />
                    <BuildControls
                        ingradientAdded={this.addIngradientHandler}
                        ingradientRemoved={this.removeIngradientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingradients={this.state.ingradients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }
        if ( this.state.loading ) {
            orderSummary = <Spinner />;
        }
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler( BurgerBuilder, axios );