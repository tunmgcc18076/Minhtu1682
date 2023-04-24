import {
  GET_FAVORITE_PRODUCTS, GET_FAVORITE_PRODUCTS_SUCCESS
} from '@/constants/constants';

const initState = {
  total: 0,
  items: []
};

export default (state = {
  total: 0,
  items: [],
}, action) => {
  switch (action.type) {
    case GET_FAVORITE_PRODUCTS_SUCCESS:
      return {
        ...state,
        total: action.payload.total,
        items: action.payload.favoriteProducts
      };
    default:
      return state;
  }
};
