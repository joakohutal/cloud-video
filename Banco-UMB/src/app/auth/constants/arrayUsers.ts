import { IUser } from '../interfaces/auth.interface';

export const arrayInfoUsers: IUser[] = [
  {
    id: 0,
    username: 'Yuri',
    password: '123456',
    fullName: 'hilca alvarez',
    email: 'hilky@gmail.com',
    rol: 'practicante',
    numberAccountBalance: 123456,
    accountBalance: 500000,
    friends: [],
    transactions: []
  },
  {
    id: 1,
    username: 'Alex',
    password: '111111',
    fullName: 'alex macleod',
    email: 'alex@gmail.com',
    rol: 'web developer',
    numberAccountBalance: 111111,
    accountBalance: 1000000,
    friends: [],
    transactions: []
  },
  {
    id: 2,
    username: 'Joaquin',
    password: '1234567',
    fullName: 'Joaquin Hurtado',
    email: 'Jhurtado@gmail.com',
    rol: 'web developer',
    numberAccountBalance: 111111,
    accountBalance: 1000000,
    friends: [],
    transactions: []
  }
]
