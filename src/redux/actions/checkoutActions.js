import {
  RESET_CHECKOUT, SET_CHECKOUT_PAYMENT_DETAILS, SET_CHECKOUT_SHIPPING_DETAILS,
  ADD_ORDER
} from '@/constants/constants';

export const setShippingDetails = (details) => ({
  type: SET_CHECKOUT_SHIPPING_DETAILS,
  payload: details
});

export const addOrder = (details) => ({
  type: ADD_ORDER,
  payload: details
});

export const setPaymentDetails = (details) => ({
  type: SET_CHECKOUT_PAYMENT_DETAILS,
  payload: details
});

export const resetCheckout = () => ({
  type: RESET_CHECKOUT
});
