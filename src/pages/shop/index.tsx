import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { InferGetStaticPropsType } from 'next';
import MainLayout from '../../components/Layout';
import ProductListRenderer from '../../components/products/ProductList';
import getJson from '../../utils/getJson';
// import { loadProducts } from '../../lib/products';
// import ListProductsView from '../../components/ListProductsView';
// import SearchBar from '../../components/SearchBar';
// import Categories from '../../components/Categories';
// import Companies from '../../components/Companies';
// import Sort from '../../components/Sort';
// import { getCategories } from '../../lib/categories';
// import { Category } from '../../types/models';
// import MainButton from '../../components/MainButton';
// import { number } from 'yup';

// const products = [
// 	{url:'test-coffe-one', id:0, photos:'https://via.placeholder.com/400x150', title:'Кофе 1', description:'Зерновой кофе  1', price:1500},
// 	{url:'test-coffe-two', id:1, photos:'https://via.placeholder.com/400x150', title:'Кофе 2', description:'Зерновой кофе  2', price:1500},
// 	{url:'test-coffe-three', id:2, photos:'https://via.placeholder.com/400x150', title:'Кофе 3', description:'Зерновой кофе  3', price:1500}
// ];

function ProductsPage({products=[],giftAccount=0}: InferGetStaticPropsType<typeof GetServerSideProps>) {
	const [company, setCompany] = useState<string>('');
	const [sortCondition, setSortCondition] = useState<string>('');
	const [isListView, setListView] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');
	return (
		<MainLayout title='Магазин' balance={true}>
			<ProductListRenderer
				skeleton
				skeletonCount={4}
				products={products}
				giftAccount={giftAccount}
				breakpoints={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 24 }}
			/>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps = async () => {
	const {result} = await getJson(process.env.host+'/api/products/getProducts');
	const marketing = await getJson(process.env.host+'/api/products/getMarketing');
	
	return {
		props: {
			products: result?.map((product: any) => ({
				title: product.title,
				description: product.description,
				id: product._id,
				image: product.image || null,
				price: product.price,
				weight: product.weight,
				url: product.url,
				marketing_price: product.marketing_price
			})) || [],
			giftAccount: marketing?.result?.giftAccount||0

		}
	};
};

export default ProductsPage;