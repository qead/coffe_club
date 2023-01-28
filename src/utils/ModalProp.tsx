import {Modal} from 'antd';
export default function ModalProp(props){
	if (!props) {
		return;
	}
	return (
		<Modal
			visible={true}
			{...props.modalProps}
		>
			{props.content}
		</Modal >
	);
}