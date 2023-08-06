import React from 'react';
import Link from 'next/link';
import { Product } from '../../actions';
import { Row, Col, Card, Typography, Button, Tag } from 'antd';
import {GiftOutlined} from '@ant-design/icons';
// import { SkeletonListContext } from '../../contexts';
const { Text } = Typography;

interface SaleProductItemProps {
  product: Product;
  giftAccount: number;
}

const SaleProductItem: React.FC<SaleProductItemProps> = ({ product, giftAccount }) => {
	// const { xl, md, sm, lg, xs } = React.useContext(SkeletonListContext);
	const {
		url,
		title,
		price,
		sale_price,
		on_sale,
		weight,
		marketing_price,
		image
	} = product;
	const featured_image = image ? image : '';
	const cashBack = typeof giftAccount == 'undefined'?'Не удалось рассчитать': price/100*giftAccount;
	return (
		<Col xl={6} lg={6} md={6} sm={12} xs={24} className="centered-col">
			<Card
				cover={
					featured_image ? <img alt="example" src={featured_image} /> : null
				}
			>
				<Row>
					<Text style={{ textAlign: 'center',width:'100%' }} strong>
						{title}
					</Text>
					{on_sale && <Button style={{ marginLeft: 10 }}>Sale!</Button>}
				</Row>
				<Row>
					<Text type="success" strong delete={on_sale}>
						Цена: {price} ₽
					</Text>
					{on_sale && (
						<Text style={{ marginLeft: 15 }}>{sale_price}</Text>
					)}
				</Row>
				<Row>
					<Text>
						Кэшбек: {cashBack} <GiftOutlined />
					</Text>
				</Row>
				<Row>
					<Text>
						Баллы: {marketing_price}
					</Text>
				</Row>
				<Row>
					<Text>
						Вес: {weight} грамм
					</Text>
				</Row>
				<Row>
					<Link href="/shop/[...product]" as={`/shop/${url}`}>
						<Button style={{margin:'10px auto 0'}} type='primary'>Купить</Button>
					</Link>
				</Row>	
			</Card>
		</Col>
	);
};

export default SaleProductItem;
