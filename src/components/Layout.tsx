import React, {useState,  useEffect} from 'react';
import Link from 'next/link';
import Auth from './auth';
import { Layout, Menu, Breadcrumb, Statistic, Button, message } from 'antd';
import {
	HomeOutlined, UserOutlined, ShopOutlined, CheckCircleOutlined, CoffeeOutlined, LinkOutlined,SyncOutlined,
	SettingOutlined, DollarOutlined,UsergroupAddOutlined,ShoppingCartOutlined,HistoryOutlined,TransactionOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import type { MenuProps } from 'antd';
import getJson from '../utils/getJson';
const { Header, Content, Footer, Sider } = Layout;
export interface BreadCrumb {
	title: string,
	link?: string,
	icon?: React.ReactNode
}
export interface MainLayout {
	readonly children: React.ReactNode,
	readonly title: string,
	balance?: boolean,
	readonly breadcrumbs: BreadCrumb[]

}

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	const href = children?label:<Link href={key}><a>{label}</a></Link>;
	return {
		key,
		icon,
		children,
		label:href
	} as MenuItem;
}
  
const items: MenuItem[] = [
	getItem('Главная', '/', <HomeOutlined />),
	getItem('О нас', '/about', <CoffeeOutlined />),
	getItem('Условия', '/terms', <CheckCircleOutlined />),
	getItem('Профиль', '/profile/', <UserOutlined />,[
		getItem('Мои  данные', '/profile', <SettingOutlined />),
		getItem('Кошелек', '/profile/balance', <DollarOutlined />),
		getItem('Мои транзакции', '/profile/transactions', <TransactionOutlined />),
		getItem('Рефералы', '/profile/referrals',<UsergroupAddOutlined/>),
		getItem('Реф. ссылка', '/profile/invite', <LinkOutlined/>)
	]),
	getItem('Магазин', '/shop/', <ShopOutlined />, [
		getItem('Продукция', '/shop',<ShopOutlined />),
		getItem('Корзина', '/shop/cart',<ShoppingCartOutlined />),
		getItem('Мои заказы', '/shop/orders',<HistoryOutlined />)
	])
];
export default function MainLayout({children, title, breadcrumbs,balance}: MainLayout):React.ReactNode{
	const [collapsed, setCollapse] = useState(false);
	const [isMobile, setMobile] = useState(false);
	const router = useRouter();
	const [balanceAmount, setBalance] = useState<string>(0);
	const getBalance = async()=>{
		const res = await getJson('/api/profile/getBalance');
		if(res.result && res.result.cash){
			setBalance(res.result.cash);
			message.success('Баланс успешно получен');
		}
	};
	useEffect(() => {
		setCollapse(window.innerWidth <= 760);
		setMobile(window.innerWidth <= 760);
		if(balance){
			getBalance();
		}
		// window.addEventListener('reize', () => {});
		// return () => {
		//   window.removeEventListener('resize', () => {})
		// }
	}, []);
	const onCollapse = ():any=>{setCollapse(!collapsed);};
	return (<Layout style={{ minHeight: '100vh' }}>
		{/* collapsible={!isMobile} */}
		<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
			<div className="logoblock" style={{
				display: 'flex',
				height: 60,
				justifyContent: 'center',
				alignItems: 'center',
				color:'#fff'
			}}>CoffeClub</div>
			<Menu theme="dark" selectedKeys={[(router?.route)||'/']} mode="inline" items={items}/>
			{/* {items.map((item,i) => (
				<Menu.Item key={item.key} icon={item.icon}>
					{item.label}
				</Menu.Item>
			))} */}
			{/* <Menu.Item key="/" icon={<HomeOutlined />}>
					<Link href="/"><a>Главная</a></Link>
				</Menu.Item>
				<Menu.Item key="/about" icon={<CoffeeOutlined />}>
					<Link href="/about"><a>О нас</a></Link>
				</Menu.Item>
				<Menu.Item key="/terms" icon={<CheckCircleOutlined />}>
					<Link href="/terms"><a>Условия</a></Link>
				</Menu.Item>
				<Menu.Item key="/profile" icon={<SettingOutlined />}>
					<Link href="/profile"><a>Профиль</a></Link>
				</Menu.Item>
				<Menu.SubMenu key="/shop" title="Магазин" icon={<DollarOutlined />}>
					<Menu.Item key="/shop/" icon={<ShopOutlined />}>
						<Link href="/shop"><a>Магазин</a></Link>
					</Menu.Item>
					<Menu.Item key="/cart" icon={<ShopOutlined />}>
						<Link href="/shop/cart"><a>Корзина</a></Link>
					</Menu.Item>
					<Menu.Item key="/orders" icon={<ShopOutlined />}>
						<Link href="/shop/orders"><a>Мои заказы</a></Link>
					</Menu.Item>
				</Menu.SubMenu>
				<Menu.SubMenu key="/profile_sub" title="Бизнес" icon={<DollarOutlined />}>
					<Menu.Item key="/profile/invite" icon={<LinkOutlined />}>
						<Link href="/profile/invite"><a>Реф. ссылка</a></Link>
					</Menu.Item>
					<Menu.Item key="/profile/referrals" icon={<UsergroupAddOutlined />}>
						<Link href="/profile/referrals"><a>Мои рефералы</a></Link>
					</Menu.Item>
				</Menu.SubMenu> */}
		</Sider>
		<Layout className="site-layout">
			<Header className="site-layout-background" style={{ padding: 0 }}>
				<div style={{ float: 'right' }}>
					<Auth isMobile={isMobile}/>
				</div>
			</Header>
			<Content style={{ margin: '0 16px' }}>
				<div style={{display:'flex', flexDirection:'row', flexWrap:'wrap', alignItems:'center',justifyContent: 'space-between'}}>
					{breadcrumbs?.length&&<Breadcrumb style={{ margin: '16px 0' }}>
						{breadcrumbs.map((item,i)=>{
							if(item.link){
								return <Breadcrumb.Item key={i}><Link href={item.link}>{item?.icon||''+' '+item?.title}</Link></Breadcrumb.Item>;
							}
							return  <Breadcrumb.Item key={i}>{item?.title}</Breadcrumb.Item>;
						})}
					</Breadcrumb>
					}
					{title&&<h1>{title}</h1>}
					{balance?<Statistic title="Денег на аккаунте" value={(balanceAmount||0)+' ₱'} formatter={value=><>{value} <SyncOutlined onClick={getBalance}/></>}/>:null}
				</div>
				<div className="site-layout-background" style={{ padding: '24px 0', minHeight: 360 }}>
					{children}
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>Coffee-club © 2023</Footer>
		</Layout>
	</Layout>);
}