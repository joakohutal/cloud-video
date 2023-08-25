import { Provider } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";

export const AuthProvider: Provider = {
  provide: 'authRepository',
  useClass: AuthService
}
