import { Provider } from "@angular/core";
import { LocalStorageService } from "src/app/core/services/local-storage.service";

export const localSProvider: Provider = {
  provide: 'localSRepository',
  useClass: LocalStorageService
}
