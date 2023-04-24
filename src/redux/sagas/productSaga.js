/* eslint-disable indent */
import {
  ADD_PRODUCT,
  ADD_FAVORITE_PRODUCT,
  EDIT_PRODUCT,
  GET_PRODUCTS,
  GET_FAVORITE_PRODUCTS,
  REMOVE_PRODUCT,
  REMOVE_FAVORITE_PRODUCT,
  SEARCH_PRODUCT,
  ADD_ORDER,
  GET_MY_ORDER
} from '@/constants/constants';
import { ADMIN_PRODUCTS, SHOP } from '@/constants/routes';
import { displayActionMessage } from '@/helpers/utils';
import {
  all, call, put, select
} from 'redux-saga/effects';
import { setLoading, setRequestStatus } from '@/redux/actions/miscActions';
import { history } from '@/routers/AppRouter';
import firebase from '@/services/firebase';
import {
  addProductSuccess,
  addFavoriteProductSuccess,
  clearSearchState, editProductSuccess, getProductsSuccess, getFavoriteProductsSuccess,
  removeProductSuccess,
  searchProductSuccess,
  getMyOrdersSuccess
} from '../actions/productActions';

function* initRequest() {
  yield put(setLoading(true));
  yield put(setRequestStatus(null));
}

function* handleError(e) {
  yield put(setLoading(false));
  yield put(setRequestStatus(e?.message || 'Failed to fetch products'));
  console.log('ERROR: ', e);
}

function* handleAction(location, message, status) {
  if (location) yield call(history.push, location);
  yield call(displayActionMessage, message, status);
}

function* productSaga({ type, payload }) {
  switch (type) {
    case GET_PRODUCTS: 
      try {
        yield initRequest();
        const state = yield select();
        const result = yield call(firebase.getProducts, payload);

        if (result.products.length === 0) {
          handleError('No items found.');
        } else {
          yield put(getProductsSuccess({
            products: result.products,
            lastKey: result.lastKey ? result.lastKey : state.products.lastRefKey,
            total: result.total ? result.total : state.products.total
          }));
          yield put(setRequestStatus(''));
        }
        // yield put({ type: SET_LAST_REF_KEY, payload: result.lastKey });
        yield put(setLoading(false));
      } catch (e) {
        console.log(e);
        yield handleError(e);
      }
      break;
    case GET_FAVORITE_PRODUCTS:
      try {
        yield initRequest();
        const state = yield select();
        const result = yield call(firebase.getFavoriteProducts, payload);
        if (result.favoriteProducts.length === 0) {
          handleError('No items found.');
        } else {
          yield put(getFavoriteProductsSuccess({
            favoriteProducts: result.favoriteProducts,
            total: result.total ? result.total : state.favoriteProducts.total
          }));
          yield put(setRequestStatus(''));
        }
        yield put(setLoading(false));
      } catch (e) {
        console.log(e);
        yield handleError(e);
      }
      break;
    case ADD_PRODUCT: {
      try {
        yield initRequest();

        const { imageCollection } = payload;
        const key = yield call(firebase.generateKey);
        const downloadURL = yield call(firebase.storeImage, key, 'products', payload.image);
        const image = { id: key, url: downloadURL };
        let images = [];

        if (imageCollection.length !== 0) {
          const imageKeys = yield all(imageCollection.map(() => firebase.generateKey));
          const imageUrls = yield all(imageCollection.map((img, i) => firebase.storeImage(imageKeys[i](), 'products', img.file)));
          images = imageUrls.map((url, i) => ({
            id: imageKeys[i](),
            url
          }));
        }

        const product = {
          ...payload,
          image: downloadURL,
          imageCollection: [image, ...images]
        };

        yield call(firebase.addProduct, key, product);
        yield put(addProductSuccess({
          id: key,
          ...product
        }));
        yield handleAction(ADMIN_PRODUCTS, 'Item succesfully added', 'success');
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add: ${e?.message}`, 'error');
      }
      break;
    }
    case ADD_FAVORITE_PRODUCT: {
      try {
        yield initRequest();
        const state = yield select();
        const key = yield call(firebase.generateKey);
        const productId = {
          productId: payload,
          userId: state.auth?.id
        };

        yield call(firebase.addFavoriteProduct, key, productId);
        yield put(addFavoriteProductSuccess({
          id: key,
          ...productId
        }));
        yield handleAction(SHOP, 'Item succesfully added into Favorites List', 'success');
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add into Favorites List: ${e?.message}`, 'error');
      }
      break;
    }
    case ADD_ORDER: {
      try {
        yield initRequest();
        const state = yield select();
        const Userkey = state.auth?.id;
        const key = yield call(firebase.generateKey);

        yield call(firebase.addOrder, Userkey, key, payload);
        // yield put(addFavoriteProductSuccess({
        //   id: key,
        //   ...productId
        // }));
        yield handleAction(SHOP, 'Your order is succesfully, please waiting contact from us', 'success');
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Your order is failed, please try again: ${e?.message}`, 'error');
      }
      break;
    }
    case EDIT_PRODUCT: {
      try {
        yield initRequest();

        const { image, imageCollection } = payload.updates;
        let newUpdates = { ...payload.updates };

        if (image.constructor === File && typeof image === 'object') {
          try {
            yield call(firebase.deleteImage, payload.id);
          } catch (e) {
            console.error('Failed to delete image ', e);
          }

          const url = yield call(firebase.storeImage, payload.id, 'products', image);
          newUpdates = { ...newUpdates, image: url };
        }

        if (imageCollection.length > 1) {
          const existingUploads = [];
          const newUploads = [];

          imageCollection.forEach((img) => {
            if (img.file) {
              newUploads.push(img);
            } else {
              existingUploads.push(img);
            }
          });

          const imageKeys = yield all(newUploads.map(() => firebase.generateKey));
          const imageUrls = yield all(newUploads.map((img, i) => firebase.storeImage(imageKeys[i](), 'products', img.file)));
          const images = imageUrls.map((url, i) => ({
            id: imageKeys[i](),
            url
          }));
          newUpdates = { ...newUpdates, imageCollection: [...existingUploads, ...images] };
        } else {
          newUpdates = {
            ...newUpdates,
            imageCollection: [{ id: new Date().getTime(), url: newUpdates.image }]
          };
          // add image thumbnail to image collection from newUpdates to
          // make sure you're adding the url not the file object.
        }

        yield call(firebase.editProduct, payload.id, newUpdates);
        yield put(editProductSuccess({
          id: payload.id,
          updates: newUpdates
        }));
        yield handleAction(ADMIN_PRODUCTS, 'Item succesfully edited', 'success');
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to edit: ${e.message}`, 'error');
      }
      break;
    }
    case REMOVE_PRODUCT: {
      try {
        yield initRequest();
        yield call(firebase.removeProduct, payload);
        yield put(removeProductSuccess(payload));
        yield put(setLoading(false));
        yield handleAction(ADMIN_PRODUCTS, 'Item succesfully removed', 'success');
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to remove: ${e.message}`, 'error');
      }
      break;
    }
    case REMOVE_FAVORITE_PRODUCT: {
      try {
        yield initRequest();
        const state = yield select();
        yield call(firebase.removeFavoriteProduct, state.auth.id ,payload);
        yield put(setLoading(false));
        // yield handleAction(SHOP, 'Item succesfully removed from Favorite', 'success');
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to remove: ${e.message}`, 'error');
      }
      break;
    }
    case SEARCH_PRODUCT: {
      try {
        yield initRequest();
        // clear search data
        yield put(clearSearchState());

        const state = yield select();
        const result = yield call(firebase.searchProducts, payload.searchKey);

        if (result.products.length === 0) {
          yield handleError({ message: 'No product found.' });
          yield put(clearSearchState());
        } else {
          yield put(searchProductSuccess({
            products: result.products,
            lastKey: result.lastKey ? result.lastKey : state.products.searchedProducts.lastRefKey,
            total: result.total ? result.total : state.products.searchedProducts.total
          }));
          yield put(setRequestStatus(''));
        }
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
      }
      break;
    }
    case GET_MY_ORDER: {
      try {
        yield initRequest();
        const state = yield select();
        const result = yield call(firebase.getOrderByUser, state.auth.id);

        if (result.myOrders.length === 0) {
          handleError('No items found.');
        } else {
          let listOrders = result.myOrders;
          listOrders.map(item => {
            item.OrderAt = new Date(item.OrderAt.seconds * 1000 + item.OrderAt.nanoseconds/1000000)
          })
          console.log(listOrders)
          yield put(getMyOrdersSuccess({
            myOrders: result.myOrders,
            total: result.total ? result.total : state.myOrders.total
          }));
          yield put(setRequestStatus(''));
        }
        // yield put({ type: SET_LAST_REF_KEY, payload: result.lastKey });
        yield put(setLoading(false));
      } catch (e) {
        console.log(e);
        yield handleError(e);
      }
      break;
    }
    default: {
      throw new Error(`Unexpected action type ${type}`);
    }
  }
}

export default productSaga;
