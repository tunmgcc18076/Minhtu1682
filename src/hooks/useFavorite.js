import { displayActionMessage } from '@/helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteProduct, removeFavoriteProducts } from '@/redux/actions/productActions';

const useFavorite = () => {
  const { favorite } = useSelector((state) => ({ favorite: state.favoriteProducts.items }));
  const dispatch = useDispatch();

  const isInFavorite = (id) => !!favorite.find((item) => item.productId === id);

  const addToFavorite = (id) => {
    if (isInFavorite(id)) {
      dispatch(removeFavoriteProducts(id));
      displayActionMessage('Item remove From Favorite', 'info');
    } else {
      dispatch(addFavoriteProduct(id));
      displayActionMessage('Item added into Favorite', 'success');
    }
  };

  return { favorite, isInFavorite, addToFavorite };
};

export default useFavorite;
