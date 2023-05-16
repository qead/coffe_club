import { useState, useEffect } from 'react';
import {
	Table,
	message,
	Text
} from 'antd';
import MainLayout from '../../components/Layout';
import getJson from '../../utils/getJson';
import { useAuthSelector } from '../../selectors';
import { ColumnsType } from 'antd/es/table';
interface DataType {
	depth: number;
	name: string;
	surname: string;
	tel: string;
	email: string;
	id: number;
	address: string;
	monthly_spend?: {marketing_amount:number,amount:number};
	group_marketing_amount: number;
	group_amount: number;
	description: string;
	children?: DataType[];
}
const tableColumns:ColumnsType<DataType> = [
	// {
	// 	title: '№',
	// 	width:50,
	// 	fixed:'left',
	// 	dataIndex: 'referralNumber'
	// },
	{
		title: 'Глубина',
		// width:200,
		columnWidth:'auto',
		fixed:'left',
		dataIndex: 'depth',
		key:'depth'
	},
	{
		title: 'Имя',
		dataIndex: 'name'
	},
	{
		title: 'Фамилия',
		dataIndex: 'surname'
	},
	{
		title: 'Телефон',
		dataIndex: 'tel'
	},
	{
		title: 'Почта',
		dataIndex: 'email'
	},
	{
		title: 'ID',
		dataIndex: 'id',
		width:50
	},
	{
		title: 'Покупок в текущем месяце',
		dataIndex: 'monthly_spend',
		sorter: {
			compare: (a, b) => (a.monthly_spend.amount||0) - (b.monthly_spend.amount||0)
		},
		render:({amount})=>amount||0
	},
	{
		title: 'Групповой обьем покупок в этом месяце',
		dataIndex: 'group_amount',
		sorter: {
			compare: (a, b) => (a.group_amount||0) - (b.group_amount||0)
		},
		render:(value)=>value||0
	},
	{
		title: 'Покупок в текущем месяце (pv)',
		dataIndex: 'monthly_spend',
		sorter: {
			compare: (a, b) => (a.monthly_spend.marketing_amount||0) - (b.monthly_spend.marketing_amount||0)
		},
		render:({marketing_amount})=>marketing_amount||0
	},
	{
		title: 'Групповой обьем покупок в этом месяце (pv)',
		dataIndex: 'group_marketing_amount',
		sorter: {
			compare: (a, b) => (a.group_marketing_amount||0) - (b.group_marketing_amount||0)
		},
		render:(value)=>value||0
	}
	// {
	// 	title: 'Действие',
	// 	key: 'operation',
	// 	fixed: 'right',
	// 	width: 120,
	// 	render: () => <a>Подробнее</a>
	// }
];
export default function Profile(ctx) {
	const {isAuth} = useAuthSelector();
	const [data, setData] = useState ([]); 
	const [loading, setLoading] = useState (true); 
	const getData = async ()=>{
		setLoading(true);
		const res = await getJson('/api/profile/getTableRefsv2');
		if(res.status!=200){
			message.error('Ошибка при получении данных');
		}else{
			setData(res.result);
		}
		setLoading(false);
	};
	useEffect (async() => {
		getData();
	}, [] );
	if(isAuth){
		return (
			<MainLayout>
				<h1>Ваши рефералы</h1>
				{data.length?<Table
					loading={loading}
					style={{margin:'20px 0'}}
					scroll={{x:600}}
					pagination={{pageSize:10,showTotal:total => `Всего ${total} рефералов по 10 глубину`}}
					columns={tableColumns}
					defaultExpandAllRows
					dataSource={data}
					// expandable={{
					// 	rowExpandable: (record) => console.log('record',record),
					// 	// expandIconColumnIndex:7
					// 	expandRowByClick: true,
					// 	expandIcon: () => <UserOutlined />
					// }}
					rowKey={record => record.id}
				/>:'...Загрузка'}
				{/* <TableWithPagination columns={tableColumns} data={data} current={page}/> */}
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