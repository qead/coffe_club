import React from 'react';
import Link from 'next/link';
import { Product } from '../../actions';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
	const {
		url,
		title,
		description,
		image,
		price,
		sale_price,
		on_sale
	} = product;
	const product_id = `${url}`;
	return (
		<>
			<div className="featured-pp">
				<Link
					href="/shop/[...url]"
					as={`/shop/${url}`}
				>
					<a>{image && <img src={image} />}</a>
				</Link>
			</div>
			<div className="description">
				<Link
					href="/shop/[...url]"
					as={`/shop/${url}`}
				>
					<a>
						<Title level={4}>{title}</Title>
						<div>
							<Text
								type="secondary"
								delete={on_sale}
								className={`${on_sale ? 'on_sale' : 'regular'}`}
							>
								₱{price}
							</Text>
							{on_sale && <Text style={{ marginLeft: 10 }}>₱{sale_price}</Text>}
						</div>
					</a>
				</Link>
			</div>
		</>
	);
};

export default ProductInfo;
