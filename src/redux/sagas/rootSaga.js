import * as ACTION from '@/constants/constants';
import { takeLatest } from 'redux-saga/effects';
import authSaga from './authSaga';
import productSaga from './productSaga';
import profileSaga from './profileSaga';

function* rootSaga() {
  yield takeLatest([
    ACTION.SIGNIN,
    ACTION.SIGNUP,
    ACTION.SIGNOUT,
    ACTION.SIGNIN_WITH_GOOGLE,
    ACTION.SIGNIN_WITH_FACEBOOK,
    ACTION.SIGNIN_WITH_GITHUB,
    ACTION.ON_AUTHSTATE_CHANGED,
    ACTION.ON_AUTHSTATE_SUCCESS,
    ACTION.ON_AUTHSTATE_FAIL,
    ACTION.SET_AUTH_PERSISTENCE,
    ACTION.RESET_PASSWORD
  ], authSaga);
  yield takeLatest([
    ACTION.ADD_PRODUCT,
    ACTION.ADD_FAVORITE_PRODUCT,
    ACTION.SEARCH_PRODUCT,
    ACTION.REMOVE_PRODUCT,
    ACTION.EDIT_PRODUCT,
    ACTION.GET_PRODUCTS,
    ACTION.GET_FAVORITE_PRODUCTS,
    ACTION.REMOVE_FAVORITE_PRODUCT,
    ACTION.ADD_ORDER,
    ACTION.GET_MY_ORDER
  ], productSaga);
  yield takeLatest([
    ACTION.UPDATE_EMAIL,
    ACTION.UPDATE_PROFILE
  ], profileSaga);
}

export default rootSaga;
