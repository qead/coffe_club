import { useState,useEffect } from 'react';
import getJson from '../../utils/getJson';
import {Button, Pagination, Table,  Popover, message, Modal, Empty, Select} from 'antd';
import {StopOutlined,CheckOutlined,EditOutlined} from '@ant-design/icons';
import MainLayout from '../../components/Layout';
import AdminLayout from '../../components/AdminLayout';
import TableWithPagination from '../../components/TableWithPagination';
import moment from 'moment';
const STATUSES = ['Заказ создан', 'Передан', 'Отменен'];
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
export default function Orders(ctx:any){
	const [data, setData] = useState ([]); 
	const [total, setTotal] = useState (0); 
	const [markContent, setMarkContent ] = useState (null); 
	const [currentOrder, setCurrentOrder ] = useState (null); 
	const [currentStatus, setCurrentStatus ] = useState (null); 
	const [page, setPage] = useState (1); 
	const editStatus  = async(status) =>{
		const response = await getJson('/api/admin/updateOrderStatus',{id:currentStatus,status});
		if(response.status==200){
			await getOrders();
			message.success('Статус успешно обновлен');

		}else{message.error('Ошибка при обновлении статус заказа');}
	};
	const changeStatusContent=()=>{
		return <><p>Редактирование статуса заказа</p><Select style={{width:'200px'}} options={STATUSES.map(item=>{return {value:item,label:item};})} onChange={editStatus}/></>;
	};
	useEffect(async() => {
		if(currentOrder){
			const {result} = await getJson('/api/admin/getOrderMark',{id:currentOrder});
			if(result.processed){
				setMarkContent(result.processed);
			}
		}
	}, [currentOrder]);
	useEffect (async() => { 
		await getOrders();
	}, [page] );
	const getOrders=async()=>{
		const response = await getJson('/api/admin/getOrders',{page});
		if(response.status==200){
			const orders = response.result?.orders || [];
			const total = response.result?.count || 0;
			setData(orders);
			setTotal(total);
		}
	};
	const columns=[
		{
			title: '№',
			render: (id, record, index) => { ++index; return (page-1)*10+index; },
			showSorterTooltip: false,
			width:50
		},
		{
			title: 'Сумма',
			dataIndex: 'price'
		},
		{
			title: 'Счет покупки',
			dataIndex: 'isGift',
			render:isGift=>isGift?'Подарочный':'Основной'
		},
		{
			title: 'Товары',
			dataIndex: 'products',
			render: products=> <ol>{products.map((item,i)=><li key={i}>{item.url+' '+item.price+' цена '+item.count+' шт.'}</li>)}</ol>
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			render:(item,{_id})=><Popover trigger="click" key="1" content={changeStatusContent}><EditOutlined  key={1} onClick={()=>setCurrentStatus(_id)} style={{marginRight:5}}/>{item}</Popover>
		},
		{
			title: 'Статус обработки',
			dataIndex: 'isProcessed',
			render:(isProc)=>isProc?<CheckOutlined style={{color:'#0f0'}}/>:<StopOutlined style={{color:'#f00'}}/>
		},
		{
			title: 'Дата',
			dataIndex: 'createdAt',
			render:(date)=>moment(date).format('LLL')
		},
		{
			dataIndex: '_id',
			title: 'Маркетинг',
			render:(id)=><Button type="primary" onClick={()=>setCurrentOrder(id)}>Подробнее</Button>
		}
	];
	if(ctx?.isAuth&&ctx?.isAdmin){
		return (<AdminLayout title="Заказы">
			<TableWithPagination
				current={page}
				total={total}
				data={data}
				paginationChange={(page)=>setPage(page)}
				PAGE_SIZE={10}
				columns={columns}
				props={{rowKey:(record)=>record._id}}
			/>
			{markContent ? (
				<Modal
					open={markContent ? true : false}
					title={
						markContent.proccessedAt
							? 'Обработан:' + moment(markContent.proccessedAt).format('LLL')
							: 'Не обработан'
					}
					onCancel={() => setMarkContent(null)}
				>
					{markContent.referers?.length ? (
						<ol>
							{markContent.referers.map(({ earned, id }, i) => (
								<li key={i}>{'id:' + id + 'Начислено' + earned}</li>
							))}
						</ol>
					) : (
						'Начисления по реф. отсутствуют'
					)}
				</Modal>
			) : null}
		</AdminLayout>);
	}
	return (<MainLayout>
		<h1>Страница для авторизованных пользователей</h1>
	</MainLayout>);
}
