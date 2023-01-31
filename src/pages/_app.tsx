import '../styles/style.sass';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useStore } from '../store';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
const App = function({ Component, pageProps }: AppProps):JSX.Element{
	const store = useStore(pageProps.initialReduxState);
	return (<ConfigProvider locale={ruRU}>
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	</ConfigProvider>);
};
export default App;