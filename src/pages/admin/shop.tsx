import { useState,useEffect } from 'react';
import getJson from '../../utils/getJson';
import { EditOutlined  } from '@ant-design/icons';
import { Space, Row, Col, Popconfirm, message, Typography, Button } from 'antd';
import MainLayout from '../../components/Layout';
import AdminLayout from '../../components/AdminLayout';
import Service from '../../components/service';
import EditProduct from '../../components/products/EditProduct';
import ModalProp from '../../utils/ModalProp';

export default function AdminShop(ctx:any){
	const [state, setState] = useState ([]); 
	const [productData, setProductData] = useState(false);
	useEffect (async() => { 
		const response =await getJson('/api/products/getProducts');
		console.log('getProducts admin', response);
		if(response?.result){
			setState(response.result);
		}
	}, [] );
	const addProduct = async (values) =>{
		const response =  await getJson('/api/admin/addProduct' ,{...values});
		if(response?.status==200){
			setProductData(false);
		}else{
			message.warning('Неудалось добавить услугу');
		}
	};
	const updateProduct = async (values) =>{
		const response =  await getJson('/api/admin/editProduct' ,{...values});
		if(response?.status==200){
			setProductData(false);
		}else{
			message.warning('Не удалось обновить услугу');
		}
	};
	if(ctx?.isAuth&&ctx?.isAdmin){
		return (<AdminLayout title='Товары'>
			<Space>
				<Button onClick={()=>setProductData('add')} style={{marginBottom:25}}>Добавить товар</Button>
			</Space>

			<div className="site-card-border-less-wrapper">
				<Row gutter={[16,16]}>
					{state?.map((data, i)=>
						<Col 
							key={i}
							xs={24} lg={12} xl={8} xxl={6}>
							<Service
								key={i}
								data={data}
								actions={[
									<EditOutlined key="edit" onClick={()=>setProductData(data)}/>
								]}
							/>
						</Col>)}
				</Row>
			</div>
			{productData && ModalProp({
				content: <EditProduct data={productData} onCompleate={productData=='add'?addProduct:updateProduct}/>,
				modalProps: {
					footer:  [<Button key={0} onClick={()=>setProductData(false)}>Закрыть</Button>],
					title: (productData=='add'?'Добавление товра':'Редактирование товара'),
					onCancel: ()=>setProductData(false)
					// bodyStyle: { paddingBottom: 0 }
				}})
			}
		</AdminLayout>);
	}
	return (<MainLayout>
		<h1>Страница для авторизованных пользователей</h1>
	</MainLayout>);
}


export  function getServerSideProps ({ req, res }){
	const isAuth = !!req?.cookies?.token;
	const isAdmin = !!req?.cookies?.isAdmin;
	if (!isAuth||!isAdmin) {
	  	return {
			redirect: {
				destination: '/404',
				permanent: false
			}
	  	};
	}
	return {
		props: {isAuth, isAdmin}
	};
}