import { useState, useEffect } from 'react';
import { message, Tree } from  'antd';
import  {DownOutlined} from  '@ant-design/icons';
import getJson from '../../utils/getJson';

const updateTreeData = (list, key, children) => list.map((node) => {
	if (node._id === key) {
		return {
			...node,
			children
		};
	}
	if (node.children) {
		return {
			...node,
			children: updateTreeData(node.children, key, children)
		};
	}
	console.log('list, node', list, node, node._id);
	return node;
});
export default function GetRefs(ctx) {
	useEffect(()=>getRefs(),[]);
	const [treeData, setTreeData] = useState([]);
	const [userData, setUserData] = useState([]);
	const getRefs = async () =>{
		let res = await getJson('/api/profile/getRefs');
		if(res.status !== 200){
			return message.warning('Ошибка при получении списка рефералов, попробуйте позже');
		}
		setTreeData(res.result);
	};
	const onLoadData = async ({ key, children }) => {
		if(children){
			return;
		}
		let res = await getJson('/api/profile/getRefs', {id:key});
		if(res.status !== 200){
			return  message.warning('Ошибка при получении списка рефералов, попробуйте позже');
		}
		setTreeData((origin) =>
			updateTreeData(origin, key, res.result)
		);
	};

	const onSelect = async ([id]) => {
		if(!id){
			return setUserData([]);
		}
		let res = await getJson('/api/profile/getUser', {id});
		if(res.status !== 200){
			return message.warning('Ошибка при получении данных пользователя');
		}
		let arrData =  Object.values(res.result);
		setUserData(arrData);
	};
	
	return <>
		{userData?.length>0&&<ul>
			{userData.map((item,i)=><li key={i}>{item}</li>)}
		</ul>}
		<Tree fieldNames={{
			title: 'surname',
			key: '_id'
		}}
		showLine
		switcherIcon={<DownOutlined />}
		loadData={onLoadData}
		treeData={treeData}
		onSelect={onSelect}
		/>
	</>;
}