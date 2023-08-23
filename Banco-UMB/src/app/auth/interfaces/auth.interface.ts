export interface IUser {
  id: number;
  username: string;
  password: string;
  fullName: string,
  email: string,
  rol: string,
  accountBalance: number,
  numberAccountBalance: number,
  friends: IUser[],
  transactions: ITransaction[]
}

export interface ITransaction {
  transferAccount: number,
  transferValue: number
}
