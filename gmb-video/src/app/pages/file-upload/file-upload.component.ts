import { Component, OnInit, ElementRef, Renderer2, ChangeDetectorRef, Inject} from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';
import { IAuthRepository } from 'src/app/domain/repository/auth.repository';
import { messagesSwalFire } from '../../core/constants/swalFire';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  selectedFile: File | null = null;
  progress: number = 0;
  uploadProgress: number | null = null;
  fileName: string = '';
  selectedCategory : string = '';
  
  constructor(
    private fileService: FileService, 
    private el: ElementRef, 
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    @Inject('authRepository') private authService: IAuthRepository
    ) {}  // Inyectamos ChangeDetectorRef
  
  ngOnInit() {}
  
  onFileSelected(event:Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  sanitizeFilename(filename: string): string {
    return filename
        // Reemplaza emojis u otros caracteres especiales con guiones
        .replace(/[^a-zA-Z0-9.]/g, '-')
        // Elimina múltiples guiones seguidos
        .replace(/-{2,}/g, '-');
}

  upload() {
    if (this.selectedFile) {

      const formData: FormData = new FormData();
      formData.append('video', this.selectedFile, this.selectedFile.name);

       // Sanitizar el nombre del archivo
       const sanitizedInputName = this.sanitizeFilename(this.fileName+'-'+this.selectedCategory);

         // Construye el nombre completo (nombre + extensión)
         const fileExtension = this.selectedFile.name.split('.').pop();
         const finalFileName = `${sanitizedInputName}.${fileExtension}`;

      // Reemplaza el nombre del archivo original con el nuevo nombre
        Object.defineProperty(this.selectedFile, 'name', {
            writable: true,
            value: finalFileName
        });

        // Continuar con la carga 
        this.fileService.uploadVideo(this.selectedFile).subscribe(
            progress => {
                this.progress = progress;
                /* console.log('Progress:', progress);  */

                this.cd.detectChanges();  // Fuerza a Angular a realizar una detección de cambios
            },
            error => {
                console.error('Error during upload:', error);
            },
            () => {
                console.log('Upload completed.');
                // Reiniciar la barra de progreso
                this.progress = 0;
                this.authService.setMessage(messagesSwalFire.correctRegister);
            }
        );
    } else {
        console.error('No file selected.');
    }
  }

  
}