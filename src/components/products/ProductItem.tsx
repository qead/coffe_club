import React from 'react';
import Link from 'next/link';
import { Product } from '../../actions';
import { Row, Col, Card, Typography, Button, Tag } from 'antd';
// import { SkeletonListContext } from '../../contexts';
const { Text } = Typography;

interface SaleProductItemProps {
  product: Product;
}

const SaleProductItem: React.FC<SaleProductItemProps> = ({ product }) => {
	// const { xl, md, sm, lg, xs } = React.useContext(SkeletonListContext);
	const {
		url,
		title,
		price,
		sale_price,
		on_sale,
		weight,
		image
	} = product;
	const featured_image = image ? image : '';
	return (
		<Link href="/shop/[...product]" as={`/shop/${url}`}>
			<Col xl={6} lg={6} md={6} sm={12} xs={24} className="centered-col">
				<Card
					hoverable
					cover={
						featured_image ? <img alt="example" src={featured_image} /> : null
					}
				>
					<Row>
						<Text style={{ textAlign: 'center' }} strong>
							{title}
						</Text>
						{on_sale && <Button style={{ marginLeft: 10 }}>Sale!</Button>}
					</Row>
					<Row>
						<Text type="secondary" delete={on_sale}>
							{price}
						</Text>
						{on_sale && (
							<Text style={{ marginLeft: 15 }}>{sale_price}</Text>
						)}
					</Row>
					<Tag color="#108ee9" style={{margin:'10px 0'}}>Вес: {weight} грамм</Tag>
				</Card>
			</Col>
		</Link>
	);
};

export default SaleProductItem;
