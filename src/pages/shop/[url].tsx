import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import MainLayout from '../../components/Layout';
import SingleProductRenderer from '../../components/SingleProduct/SingleProductRenderer';
import loadProducts from '../../lib/loadProducts';
import getJson from '../../utils/getJson';
// import { useProductSelector } from '../../selectors';
import { fetchProducts } from '../../actions';
import {  GetStaticProps,GetStaticPaths   } from 'next';
// import ProductModel from '../../../server/utils/dbConnect';
// import ProductModel from '../../../server/models/Product';
const Product = ({product}) => {
	const [isLoading, setLoading] = useState(false);

	// const router = useRouter();
	// const { product: productParam } = router.query;
	// const productId = productParam ? productParam[0] : null;

	// const { currentProduct } = useProductSelector();
	// const currentProductId = `${currentProduct?.id ?? ''}`;
	// const currentProductName = currentProduct?.name ?? '...';

	// const dispatch = useDispatch();

	// useEffect(() => {
	// 	if (productId && productId !== currentProductId) {
	// 		setLoading(true);
	// 		dispatch(
	// 			fetchProductById(productId, () => {
	// 				setLoading(false);
	// 			})
	// 		);
	// 	}
	// }, [productId]);

	return (
		<MainLayout title={'Страница товара'} balance={true} breadcrumbs={[{title:'Главная', link:'/'},{title:'Магазин', link:'/shop/'},{title:'Товар'}]}>
			<SingleProductRenderer
				product={product}
				loading={isLoading}
				breakpoints={[
					{ xl: 10, lg: 10, md: 10, sm: 24, xs: 0 },
					{ xl: 14, lg: 14, md: 14, sm: 24, xs: 0 }
				]}
			/>
		</MainLayout>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const result = await loadProducts();
	// const paths = mapEntriesSlugToPaths(products);
	if (process.env.SKIP_BUILD_STATIC_GENERATION) {
		return {
			paths: [],
			fallback: 'blocking'
		};
	}
	// const {result} = await getJson(process.env.host+'/api/products/getProducts');
	return {
		paths:result?.map((product: any) => ({params: { url: `${product.url}` }})) || [],
		fallback: false
	};
};
// export const getStaticPaths: GetStaticPaths = async () => {
// 	// Получите список товаров или URL-адресов товаров из вашего источника данных
// 	const products = await loadProducts();
// 	// Создайте массив путей, используя URL-адреса товаров
// 	const paths = products.map((product) => ({
// 		params: { url: product.url }
// 	}));
// 	return {
// 		paths,
// 		fallback: 'true'
// 	};
// };
export const getStaticProps:GetStaticProps = async ({ params }) => {
	// Получите идентификатор товара из параметров
	const url = params?.url;
	// Выполните запрос к вашему источнику данных, чтобы получить данные о товаре
	if(!url){
		throw new Error('Ошибка при получении url GetStaticProps');
	}
	const [result] = await loadProducts({url});
	return {
		props: {
			product: {
				url: result?.url || 'null',
				title: result?.title || 'null',
				description: result?.description || 'null',
				image: result?.image || 'null',
				price: result?.price || 'null',
				weight: result?.weight || 0,
				marketing_price: result?.marketing_price || 'null'
			}
		// revalidate: 5 // Установите время повторной генерации в секундах
		}
	};
};
export default Product;
