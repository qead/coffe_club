import { AuthTypes } from '../types';

export interface Login {
  type: AuthTypes.login;
}

export interface Logout {
  type: AuthTypes.logout;
}