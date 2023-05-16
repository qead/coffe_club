import App from 'next/app';
import {Button, Result} from 'antd';
import MainLayout from '../components/Layout';
// import NotFound from '../pulic/NotFound';
import Link  from 'next/link';
export default function Terms(props):JSX.Element {
	// const { count, increment, decrement, reset } = useCounter();
	return (<MainLayout>
		<Result
			// icon={<NotFound />}
			status="404"
			title="Страница не найденна"
			subTitle="Возможно вы ввели адрес страницы неправильно."
			extra={<Link href="/"><Button type="primary">На главную</Button></Link>}
		/>
	</MainLayout>);
}
// export function getServerSideProps() {
// 	return { props: { initialReduxState: reduxStore.getState() } };
// }
