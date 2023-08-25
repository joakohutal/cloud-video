export interface IUser {
  id: number;
  username: string;
  password: string;
  fullName: string,
  email: string,
  rol: string,
}

export interface ITransaction {
  transferAccount: number,
  transferValue: number
}
