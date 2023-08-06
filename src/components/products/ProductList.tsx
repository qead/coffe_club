import React from 'react';
import { Product } from '../../actions';
import ProductItem from './ProductItem';
import MainRowLayout from '../MainRowLayout';

interface SaleProductListProps {
  products: Product[];
  giftAccount: number;
}

const ProductList: React.FC<SaleProductListProps> = ({ products,giftAccount }) => {
	return (
		<MainRowLayout rowClassName="product-list">
			{products.map((product,i) => {
				return <ProductItem product={product} giftAccount={giftAccount} key={i} />;
			})}
		</MainRowLayout>
	);
};

export default ProductList;
