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
		<h1>Home</h1>
		<pre>{JSON.stringify(reduxStore.getState())}</pre>
		<Button onClick={()=>dispatch({
			type: 'SET_TOKEN',
			token: 'idite vse nahui'
		})}>DISPATCH</Button>
		<h1>{count}</h1>
		<Button onClick={increment}>+1</Button>
		<Button onClick={decrement}>-1</Button>
		<Button onClick={reset}>reset</Button>
	</MainLayout>);
}
export function getServerSideProps() {
	return { props: { initialReduxState: reduxStore.getState() } };
}
