import { Dispatch } from 'redux';
import {
	Login,
	Logout
} from './auth_interfaces';

import { AuthTypes } from '../types';

export const authLogin = () => {
	return (dispatch: Dispatch) => {
		dispatch<Login>({
			type: AuthTypes.login
		});
	};
};

export const authLogout = () => {
	return (dispatch: Dispatch) => {
		dispatch<Logout>({
			type: AuthTypes.logout
		});
	};
};
