import React from 'react';
import { Product } from '../../actions';
import ProductItem from './ProductItem';
import MainRowLayout from '../MainRowLayout';

interface SaleProductListProps {
  products: Product[];
}

const ProductList: React.FC<SaleProductListProps> = ({ products }) => {
	return (
		<MainRowLayout rowClassName="product-list">
			{products.map((product,i) => {
				return <ProductItem product={product} key={i} />;
			})}
		</MainRowLayout>
	);
};

export default ProductList;
