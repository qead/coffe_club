import { useSelector } from 'react-redux';
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
	const isAuth = useSelector((state) => state.isAuth);
	const [state, setState] = useState ([]); 
	useEffect ( async() => {
		const userInfo = await getJson('/api/profile/getUser');
		if(userInfo?.result){
		 	setState(userInfo.result);
		}
	}, [] );
	if(isAuth){
		return (
			<MainLayout>
				<h1>Профиль</h1>
				<div className="site-input-group-wrapper" style={{maxWidth:'500px'}}>
					<Input.Group>
						<p>Ваша страна</p>
						<Input value={state.country}/>
					</Input.Group>
					<br/>
					<Input.Group>
						<p>Ваш город</p>
						<Input value={state.city}/>
					</Input.Group>
					<br/>
					<Input.Group>
						<p>Ваше Имя</p>
						<Input value={state.name}/>
					</Input.Group>
					<br/>
					<Input.Group>
						<p>Ваша Фамилия</p>
						<Input value={state.surname} />
					</Input.Group>
					<br/>
					<Input.Group>
						<p>Ваша Дата рождения</p>
						<span>{moment(state.birthDate).format('YYYY/MM/DD')}</span>
					</Input.Group>
					<br/>
					<Input.Group>
						<p>Ваш E-mail</p>
						<Input value={state.email} />
					</Input.Group>
					<br/>
					<Input.Group>
						<p>Ваш номер телефона</p>
						<Input value={state.tel}/>
					</Input.Group>
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