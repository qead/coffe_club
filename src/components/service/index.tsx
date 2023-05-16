import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import React from 'react';

const { Meta } = Card;

const Service: React.FC = ({data,actions}) => (
	<Card
		style={{maxWidth: 300 }}
		cover={
			<img
				alt="example"
				src={data?.image}
			/>
		}
		actions={actions}
	>
		<p>{data.price}</p>
		<Meta
			title={data?.title}
			description={data?.description}
		/>
	</Card>
);

export default Service;