import { useState,useEffect } from 'react';
import getJson from '../utils/getJson';
import { EditOutlined  } from '@ant-design/icons';
import { Row, Col, InputNumber, Popconfirm, message, Typography, Button, messaage } from 'antd';
import MainLayout from '../components/Layout';
import Layout from '../components/Layout';
import Service from '../components/service';
import EditService from '../components/service/EditService';
import ModalProp from '../utils/ModalProp';

export default function Services(ctx:any){
	const [services, setServices] = useState ([]); 
	useEffect (async() => {
		const response =await getJson('/api/user/getServices');
		if(response?.result){
			console.log('response.result', response.result);
			setServices(response.result);
		}
	}, [] );
	return (<MainLayout>
		<h1>Услуги</h1>
		<div className="site-card-border-less-wrapper">
			<Row gutter={16}>
				{services?.map && services.map((data, i)=>
					<Col 
						key={i}
						span={8}>
						<Service
							data={data}
						/>
					</Col>)}
			</Row>
		</div>
	</MainLayout>);
}
