
export interface AuthState {
	isAuth: boolean,
	token: string
}

export const initialState: AuthState = {
	isAuth: false,
	token: ''
};

export default function(state=initialState, action:any){
	switch (action.type) {
	case 'LOGIN':
		return {
			...state,
			isAuth: true
		};
	case 'LOGOUT':
		return {
			...state,
			isAuth: false
		};
	case 'SET_TOKEN':
		return {
			...state,
			token: action.token
		};
	default:
		return state;
	}
}