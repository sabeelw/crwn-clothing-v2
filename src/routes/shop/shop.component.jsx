import { Fragment, useContext } from 'react';

import ProductCard from '../../components/product-card/product-card.component';

import { CategoriesContext } from '../../contexts/products.context';

import './shop.styles.scss';

const Shop = () => {
  const { CategoriesMap } = useContext(CategoriesContext);

  return (
    <div className='products-container'>
      {Object.keys(CategoriesMap).map((category) => {
        return (
          <div key={category}>
            <h1 className='category-title'>{category}</h1>
            <div className='products'>
              {CategoriesMap[category].items.map((product) => {
                return (
                  <Fragment key={product.id}>
                    <ProductCard product={product} />
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Shop;
