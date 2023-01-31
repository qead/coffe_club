import App from 'next/app';
import {Button} from 'antd';
import MainLayout from '../components/Layout';
export default function Terms(props):JSX.Element {
	// const { count, increment, decrement, reset } = useCounter();
	return (<MainLayout>
		<h1>Условия соглашения</h1>
	</MainLayout>);
}
// export function getServerSideProps() {
// 	return { props: { initialReduxState: reduxStore.getState() } };
// }
