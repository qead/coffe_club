import {useState} from 'react';
import Link from 'next/link';
import Auth from './auth';
import { Layout, Menu, Breadcrumb } from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import { useRouter } from 'next/router';
const { Header, Content, Footer, Sider } = Layout;
export interface MainLayout {
	readonly children: React.ReactNode
}
export default function MainLayout({children}: MainLayout):React.ReactNode{
	const [collapsed, setCollapse] = useState(false);
	const isMobile = false;
	const router = useRouter();
	const onCollapse = ():any=>{setCollapse(!collapsed);};
	return (<Layout style={{ minHeight: '100vh' }}>
		<Sider collapsible={isMobile?false:true} collapsed={isMobile?true:collapsed} onCollapse={onCollapse}>
			<div className="logo" />
			<Menu theme="dark" selectedKeys={[(router?.route)||'/']} mode="inline">
				<div className="logoblock" style={{
					display: 'flex',
					height: 60,
					justifyContent: 'center',
					alignItems: 'center'
				}}>Site Logo</div>
				<Menu.Item key="/" icon={<HomeOutlined />}>
					<Link href="/"><a>Главная</a></Link>
				</Menu.Item>
				<Menu.Item key="/about" icon={<HomeOutlined />}>
					<Link href="/about"><a>О нас</a></Link>
				</Menu.Item>
				<Menu.Item key="/profile" icon={<HomeOutlined />}>
					<Link href="/profile"><a>Профиль</a></Link>
				</Menu.Item>
			</Menu>
		</Sider>
		<Layout className="site-layout">
			<Header className="site-layout-background" style={{ padding: 0 }}>
				<div style={{ float: 'right' }}>
					<Auth isMobile={false}/>
				</div>
			</Header>
			<Content style={{ margin: '0 16px' }}>
				{/* <Breadcrumb style={{ margin: '16px 0' }}>
					<Breadcrumb.Item>User</Breadcrumb.Item>
					<Breadcrumb.Item>Bill</Breadcrumb.Item>
				</Breadcrumb> */}
				<div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
					{children}
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>Coffe-club ©2023</Footer>
		</Layout>
	</Layout>);
}