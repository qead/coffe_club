import '../styles/style.sass';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useStore } from '../store';

const App = function({ Component, pageProps }: AppProps):JSX.Element{
	const store = useStore(pageProps.initialReduxState);
	return (<Provider store={store}>
		<Component {...pageProps} />
	</Provider>);
};
export default App;