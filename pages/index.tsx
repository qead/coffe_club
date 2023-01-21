import { useSelector, useDispatch } from 'react-redux';
import { initializeStore } from '../store';
import App from 'next/app';
import {Button} from 'antd';
import MainLayout from '../components/Layout';
const reduxStore = initializeStore();
const { dispatch } = reduxStore;
const useCounter = () => {
	const count = useSelector((state) => state.count);
	const dispatch = useDispatch();
	const increment = () =>
	  dispatch({
			type: 'INCREMENT'
	  });
	const decrement = () =>
	  dispatch({
			type: 'DECREMENT'
	  });
	const reset = () =>
	  dispatch({
			type: 'RESET'
	  });
	return { count, increment, decrement, reset };
};
export default function Home(props):JSX.Element {
	const { count, increment, decrement, reset } = useCounter();
	return (<MainLayout>
		<h1>clubofcoffe.shop</h1>
	</MainLayout>);
}
export function getServerSideProps() {
	return { props: { initialReduxState: reduxStore.getState() } };
}
