import { useAuthSelector } from '../../selectors';
import { useState, useEffect } from 'react';
import {
	Tree,
	Input,
	Row,
	Col,
	Tooltip,
	DatePicker,
	Button,
	message
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Layout';
import getJson from '../../utils/getJson';
import copyText from '../../utils/copyText';
import moment from 'moment';
import GetRefs from '../../components/profile/GetRefs';


export default function Profile(ctx) {
	const {isAuth} = useAuthSelector();
	const [id, setId] = useState (''); 
	useEffect ( async() => {
		const res = await getJson('/api/profile/getUser');
		if(res?.result?.id){
			setId(res.result.id);
		}else{
			message.warning('Не удалось получить id пользователя');
		}
	}, [] );
	if(isAuth){
		return (
			<MainLayout>
				<h1>Реферальная ссылка</h1>
				<div style={{maxWidth:'500px'}}>
					<Input
						// style={{ width: 'calc(100% - 32px)' }}
						value={`${window.location.origin}/register?referrer=${id}`}
					/>
					<Tooltip title="Скопировать реф. ссылку">
						<Button icon={<CopyOutlined />} onClick={()=>copyText(`${window.location.origin}/register?referrer=${id}`, message)}>Скопировать</Button>
					</Tooltip>
				</div>
			</MainLayout>);
	}
	return (<MainLayout>
		<h1>Страница для авторизованных пользователей</h1>
	</MainLayout>);
}
export const getServerSideProps = async function ({ req, res }){
	// Get the user's session based on the request
	const isAuth = !!req?.cookies?.token;
	if (!isAuth) {
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		};
	}
	return {
		props: {isAuth}
	};
};