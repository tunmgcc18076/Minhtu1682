/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectFilter } from '@/selectors/selector';
import SelectUser from '../message/SelectedUser'

const Favorite = () => {
  useDocumentTitle('Favorite | PesticidesShop');
  useScrollTop();

  const findFavorite = (productArray, favoriteArray) => {
    let array = [];
    productArray.forEach(prod => {
      return(
        favoriteArray.forEach(fav => {
          if(fav.productId === prod.id) return array.push(prod);
        })
      )
    })
    return array;
  }

  const store = useSelector((state) => ({
    filteredProducts: selectFilter(findFavorite(state.products.items, state.favoriteProducts.items), state.filter),
    products: state.products,
    requestStatus: state.app.requestStatus,
    isLoading: state.app.loading,
    user: state.auth,
    favoriteProducts: state.favoriteProducts
  }), shallowEqual);

  return (
    <main className="content">
      <section className="product-list-wrapper">
        <AppliedFilters filteredProductsCount={store.filteredProducts.length} />
        <ProductList {...store}>
          <ProductGrid products={store.filteredProducts} favorite={store.favoriteProducts}/>
        </ProductList>
      </section>
      <SelectUser/>
    </main>
  );
};

export default Favorite;
