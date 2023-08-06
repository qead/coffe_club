import {useState} from 'react';
import Link from 'next/link';
import Auth from './auth';
import { Layout, Menu, Breadcrumb, Button, MenuProps } from 'antd';
import {ShopOutlined,PieChartOutlined,UserOutlined,SlidersOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
const { Header, Content, Footer, Sider } = Layout;
export interface MainLayout {
	readonly children: React.ReactNode,
	readonly title: string
}
type MenuItem = Required<MenuProps>['items'][number];
const items:MenuItem[]=[
	{ 
		key: '/admin',
		label: <Link href="/admin"><a>Статистика</a></Link>,
		icon: <PieChartOutlined />
	},
	{ 
		key: '/admin/marketing',
		label: <Link href="/admin/marketing"><a>Маркетинг</a></Link>,
		icon: <ShopOutlined />
	},
	{ 
		key: '/admin/shop',
		label: <Link href="/admin/shop"><a>Магазин</a></Link>,
		icon: <ShopOutlined />
	},
	{ 
		key: '/admin/users',
		label: <Link href="/admin/users"><a>Пользователи</a></Link>,
		icon: <UserOutlined /> 
	},
	{ 
		key: '/admin/orders',
		label: <Link href="/admin/orders"><a>Заказы</a></Link>,
		icon: <UserOutlined />
	}
];
export default function AdminLayout({children, title}: MainLayout):React.ReactNode{
	const [collapsed, setCollapse] = useState(false);
	const isMobile = false;
	const router = useRouter();
	const onCollapse = ():any=>{setCollapse(!collapsed);};
	return (<Layout style={{ minHeight: '100vh' }}>
		<Sider collapsible={isMobile?false:true} collapsed={isMobile?true:collapsed} onCollapse={onCollapse}>
			<div className="logoblock" style={{
				display: 'flex',
				height: 60,
				justifyContent: 'center',
				alignItems: 'center',
				color:'#fff'
			}}>CoffeClub</div>
			<Menu theme="dark" selectedKeys={[(router?.route)||'/']} mode="inline" items={items}/>
		</Sider>
		<Layout className="site-layout">
			<Header className="site-layout-background" style={{ padding: 0 }}>
				<div style={{ float: 'right' }}>
					<Auth isMobile={false}/>
				</div>
			</Header>
			<Content style={{ margin: '0 16px' }}>
				{title&&<h1>{title}</h1>}
				<div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
					{children}
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>Coffee-club ©2023</Footer>
		</Layout>
	</Layout>);
}