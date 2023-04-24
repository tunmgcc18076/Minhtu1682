import {
  GET_MY_ORDER_SUCCESS
} from '@/constants/constants';

const initState = {
  total: 0,
  items: []
};

export default (state = {
  total: 0,
  items: []
}, action) => {
  switch (action.type) {
    case GET_MY_ORDER_SUCCESS:
      return {
        ...state,
        total: action.payload.total,
        items: action.payload.myOrders
      };
    default:
      return state;
  }
};
