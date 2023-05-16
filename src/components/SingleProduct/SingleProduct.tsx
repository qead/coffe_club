import React from 'react';
import { Row, Col, Typography, Descriptions, Button, Tag } from 'antd';
import cartNotification from './CartNotification';
import { Product, addToCart } from '../../actions';
import { useDispatch } from 'react-redux';
import { SingleProductContext } from '../../contexts';
import './SingleProduct.less';

const { Text } = Typography;
const { Item } = Descriptions;

interface SingleProductProps {
  product: Product;
}

const SingleProduct: React.FC<SingleProductProps> = ({ product }) => {
	const breakpoints = React.useContext(SingleProductContext);
	const dispatch = useDispatch();
	const {
		url,
		title,
		description,
		image,
		price,
		marketing_price,
		weight,
		sale_price,
		on_sale
	} = product;
	const featured_image = image ? image : 'https://via.placeholder.com/300x150';

	const addItemToCart = () => {
		dispatch(addToCart(url, price));
		cartNotification();
	};

	return (
		<>
			<Row className="product-wrapper" justify="space-around">
				<Col
					xl={breakpoints[0].xl}
					lg={breakpoints[0].lg}
					md={breakpoints[0].md}
					sm={breakpoints[0].sm}
					className="product-image"
				>
					<img src={featured_image} />
				</Col>
				<Col
					xl={breakpoints[1].xl}
					lg={breakpoints[1].lg}
					md={breakpoints[1].md}
					sm={breakpoints[1].sm}
					className="product-description"
				>
					<Tag color="#108ee9">Вес: {weight} грамм</Tag>
					<Descriptions title={title} column={1}>
						<Item key="price" label="Цена" className="price-description">
							<Text
								type="secondary"
								delete={on_sale}
								className={`${on_sale ? 'on_sale' : 'regular'}`}
							>
								{price}
							</Text>
							{on_sale && <Text style={{ marginLeft: 15 }}>{sale_price}</Text>}
						</Item>
						<Item key="marketing_price" label="Баллы">{marketing_price}</Item>
						<Item key="desc" label="Описание">
							<p dangerouslySetInnerHTML={{ __html: description }} />
						</Item>
						<Item key="button" label="">
							<Button type="primary" onClick={addItemToCart}>
								Добавить в корзину
							</Button>
						</Item>
					</Descriptions>
				</Col>
			</Row>
		</>
	);
};

export default SingleProduct;
