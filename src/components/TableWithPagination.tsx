import React from 'react';
import { Table, Pagination, Empty } from 'antd';
interface TableWithPaginationProps {
	columns: [];
	data: [];
	paginationChange: (page: number) => void;
	current: number;
	total: number;
	PAGE_SIZE: number;
	rowClassName?: string;
}
const TableWithPagination:React.FC<TableWithPaginationProps> = ({columns, data, paginationChange, current, total,PAGE_SIZE, props}) => {
	return data.length && total>0?
		<>
			<Table
				style={{margin:'20px 0'}} 
				scroll={{x:600}}
				pagination={false}
				columns={columns}
				dataSource={data}
				bordered
				{...props}
			/>
			<Pagination current={current} total={total} pageSize={PAGE_SIZE||10} onChange={paginationChange}/>
		</>:<Empty />;
};
 
export default TableWithPagination;