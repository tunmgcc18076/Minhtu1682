import {
  ADD_PRODUCT,
  ADD_PRODUCT_SUCCESS,
  ADD_FAVORITE_PRODUCT,
  ADD_FAVORITE_PRODUCT_SUCCESS,
  REMOVE_FAVORITE_PRODUCT,
  CANCEL_GET_PRODUCTS,
  CLEAR_SEARCH_STATE,
  EDIT_PRODUCT,
  EDIT_PRODUCT_SUCCESS,
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_FAVORITE_PRODUCTS,
  GET_FAVORITE_PRODUCTS_SUCCESS,
  REMOVE_PRODUCT,
  REMOVE_PRODUCT_SUCCESS,
  SEARCH_PRODUCT,
  SEARCH_PRODUCT_SUCCESS,
  GET_MY_ORDER,
  GET_MY_ORDER_SUCCESS
} from '@/constants/constants';

export const getProducts = (lastRef) => ({
  type: GET_PRODUCTS,
  payload: lastRef
});

export const getProductsSuccess = (products) => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: products
});

export const getMyOrders = () => ({
  type: GET_MY_ORDER,
  payload: ''
});

export const getMyOrdersSuccess = (orders) => ({
  type: GET_MY_ORDER_SUCCESS,
  payload: orders
});

export const getFavoriteProducts = (userId) => ({
  type: GET_FAVORITE_PRODUCTS,
  payload: userId
});

export const getFavoriteProductsSuccess = (products) => ({
  type: GET_FAVORITE_PRODUCTS_SUCCESS,
  payload: products
});

export const removeFavoriteProducts = (productId) => ({
  type: REMOVE_FAVORITE_PRODUCT,
  payload: productId
});

export const cancelGetProducts = () => ({
  type: CANCEL_GET_PRODUCTS
});

export const addProduct = (product) => ({
  type: ADD_PRODUCT,
  payload: product
});

export const addFavoriteProduct = (productId) => ({
  type: ADD_FAVORITE_PRODUCT,
  payload: productId
});

export const searchProduct = (searchKey) => ({
  type: SEARCH_PRODUCT,
  payload: {
    searchKey
  }
});

export const searchProductSuccess = (products) => ({
  type: SEARCH_PRODUCT_SUCCESS,
  payload: products
});

export const clearSearchState = () => ({
  type: CLEAR_SEARCH_STATE
});

export const addProductSuccess = (product) => ({
  type: ADD_PRODUCT_SUCCESS,
  payload: product
});

export const addFavoriteProductSuccess = (productId) => ({
  type: ADD_FAVORITE_PRODUCT_SUCCESS,
  payload: productId
});

export const removeProduct = (id) => ({
  type: REMOVE_PRODUCT,
  payload: id
});

export const removeProductSuccess = (id) => ({
  type: REMOVE_PRODUCT_SUCCESS,
  payload: id
});

export const editProduct = (id, updates) => ({
  type: EDIT_PRODUCT,
  payload: {
    id,
    updates
  }
});

export const editProductSuccess = (updates) => ({
  type: EDIT_PRODUCT_SUCCESS,
  payload: updates
});
