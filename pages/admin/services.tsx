import { useState,useEffect } from 'react';
import getJson from '../../utils/getJson';
import { EditOutlined  } from '@ant-design/icons';
import { Space, Row, Col, Popconfirm, message, Typography, Button } from 'antd';
import MainLayout from '../../components/Layout';
import AdminLayout from '../../components/AdminLayout';
import Service from '../../components/service';
import EditService from '../../components/service/EditService';
import ModalProp from '../../utils/ModalProp';

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
export default function AdminPanel(ctx:any){
	const [state, setState] = useState ([]); 
	const [serviceModal, setServiceM] = useState(false);
	useEffect (async() => { 
		const response =await getJson('/api/user/getServices');
		console.log('getServices', response);
		if(response?.result){
			setState(response.result);
		}
	}, [] );
	const addService = async (values) =>{
		const response =  await getJson('/api/admin/editService',{...values});
		if(response?.status==200){
			setServiceM(false);
		}else{
			message.warning('Неудалось добавить услугу');
		}
	};
	const updateService = async (values) =>{
		const response =  await getJson('/api/admin/editService',{...values});
		if(response?.status==200){
			setServiceM(false);
		}else{
			message.warning('Не удалось обновить услугу');
		}
	};
	if(ctx?.isAuth&&ctx?.isAdmin){
		return (<AdminLayout>
			<Space>
				<h1>Услуги</h1>
				<Button onClick={()=>setServiceM('add')} className="mb-3">Добавить услугу</Button>
			</Space>

			<div className="site-card-border-less-wrapper">
				<Row gutter={16}>
					{state.map((data, i)=>
						<Col 
							key={i}
							span={8}>
							<Service
								data={data}
								actions={[
									<EditOutlined key="edit" onClick={()=>setServiceM(data)}/>
								]}
							/>
						</Col>)}
				</Row>
			</div>
			{serviceModal && ModalProp({
				content: <EditService data={serviceModal} onCompleate={serviceModal=='add'?addService:updateService}/>,
				modalProps: {
					footer:  [<Button key={0} onClick={()=>setServiceM(false)}>Закрыть</Button>],
					title: (serviceModal=='add'?'Добавление услуги':'Редактирование услуги'),
					onCancel: ()=>setServiceM(false)
					// bodyStyle: { paddingBottom: 0 }
				}})
			}
		</AdminLayout>);
	}
	return (<MainLayout>
		<h1>Страница для авторизованных пользователей</h1>
	</MainLayout>);
}
