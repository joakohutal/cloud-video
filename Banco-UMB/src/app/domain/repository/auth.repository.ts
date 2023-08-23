import { IUser } from "src/app/auth/interfaces/auth.interface";

export interface IAuthRepository {
  validation(username: string, password: string): IUser | undefined;
  verifyAuthentication(): boolean;
  logout(): void;
  setMessage(message: any): void;
}
