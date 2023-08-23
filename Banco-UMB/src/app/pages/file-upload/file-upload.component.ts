import { Component, OnInit, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  selectedFile: File | null = null;
  progress: number = 0;
  uploadProgress: number | null = null;
  constructor(
    private fileService: FileService, 
    private el: ElementRef, 
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    ) {}  // Inyectamos ChangeDetectorRef
  
  ngOnInit() {}
  
  onFileSelected(event:Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  upload() {
    if (this.selectedFile) {
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
                // Mostrar el modal de éxito
                this.showModal('successModal');
                // Reiniciar la barra de progreso
                this.progress = 0;
            }
        );
    } else {
        console.error('No file selected.');
    }
  }
  showModal(modalId: string): void {
    const modal = this.el.nativeElement.querySelector(`#${modalId}`);
    const event = new Event('click');
    modal.dispatchEvent(event);
}
  
}