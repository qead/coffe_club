import { useRouter } from 'next/router';
import { Button, Space, message } from 'antd';
import { useState,useEffect } from 'react';
import { useAuthSelector } from '../../selectors';
import { useDispatch } from 'react-redux';
// import Login from './Login';
// import Register from './Register';
import ModalProp from '../../utils/ModalProp';
import { LoginOutlined, UserAddOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { initializeStore } from '../../store';

const reduxStore = initializeStore();
const { dispatch } = reduxStore;
const useAuth = () => {
	const {isAuth} = useAuthSelector();
	const dispatch = useDispatch();
	const LOGIN = () =>
	  dispatch({
			type: 'LOGIN'
	  });
	const LOGOUT = () =>
	  dispatch({
			type: 'LOGOUT'
		});
	return { isAuth, LOGIN, LOGOUT };
};

export default function Auth({isMobile}){
	const { isAuth, LOGIN, LOGOUT } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	useEffect(() => {
		console.log('Auth component is render!');
		checkAuth();
	}, []);
	// let closeModal  = ()=> setShowModal(false);
	let checkAuth = async() => {
		try {
			let res = await fetch('/api/auth/isAuth');
			if(res.status==200){		
				console.log('checkAuth LOGIN, default value:', isAuth, 'new value:',true);
				LOGIN();
			}else{
				console.log('checkAuth LOGOUT, default value:', isAuth, 'new value:',false);
				LOGOUT();
			}
		} catch (err) {
			message.warning('Ошибка при проверке аккаунта на авторизацию');
		}
	};
	let logout=async()=>{
		setLoading(true);
		try {
			await fetch('/api/auth/logout');
			checkAuth();
		} catch (err) {
			message.warning('Ошибка при попытке выхода из аккаунта');
		}		
		setLoading(false);
	};
	let onClick = type => {
		switch (type) {
		case 'login':
			router.push('/login');
			// setShowModal({ content: <Login closeModal={closeModal} />, modalProps: {
			// 	title: 'Авторизация',
			// 	footer: [
			// 		<Button key={0} onClick={closeModal}>Отмена</Button>
			// 	],
			// 	onCancel: closeModal,
			// 	bodyStyle: { paddingBottom: 0 } }
			// });
			break;
		case 'register':
			router.push('/register');
			// setShowModal({ content: <Register closeModal={closeModal} />, modalProps: { title: 'Регистрация' }});
			break;
		case 'quit':
			logout();
			break;
		case 'profile':
			router.push('/profile');
			break;
		}
	};
	return <>
    		{showModal && ModalProp(showModal)}
		<Space direction="horizontal" wrap style={{padding:'0 5px'}}>
			<Button
				loading={loading}
				icon={isAuth ? <UserOutlined /> : < UserAddOutlined />}
				className="row-item-m5"
				onClick={() => onClick(isAuth ? 'profile' : 'login')}>
				{!isMobile&&(isAuth ? 'Профиль' : 'Войти')}
			</Button>
			<Button
				loading={loading}
				icon={isAuth ? <LogoutOutlined /> : <LoginOutlined />}
				type={isAuth ? 'danger' : 'primary'}
				className="row-item-m5"
				onClick={() => onClick(isAuth ? 'quit' : 'register')}>
				{!isMobile&&(isAuth ? 'Выйти' : 'Регистрация')}
			</Button>
		</Space>
	</>;
}