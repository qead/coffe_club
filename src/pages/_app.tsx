import '../styles/style.less';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { useStore } from '../store';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';  // without this line it didn't work
moment.locale('ru');
const App = function({ Component, pageProps }: AppProps):JSX.Element{
	const store = useStore(pageProps.initialReduxState);
	return (<ConfigProvider locale={ruRU}>
		<Provider store={store}>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
			</Head>
			<Component {...pageProps} />
		</Provider>
	</ConfigProvider>);
};
export default App;