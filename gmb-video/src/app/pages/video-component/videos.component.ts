import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  videos: string[] = [];
  filteredVideos: string[] = [];
  allVideos: string[] = [];

  constructor(
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.getVideos();
  }
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoSource', { static: false }) videoSource!: ElementRef<HTMLVideoElement>;

  selectedVideo: string | null = null;
  selectedVideoUrl: string | null = null;

  getVideos() {
    this.fileService.getVideos().subscribe(
      videos => {
        this.videos = videos;
        this.filteredVideos = [...videos]; // Asegura de que filteredVideos muestre todos los videos por defecto
      },
      error => console.error('Error fetching videos:', error)
    );
  }

  playVideo(videoName: string) {
    this.selectedVideoUrl = null; // Establece a null primero
    setTimeout(() => {
      this.selectedVideoUrl = this.fileService.getVideoUrl(videoName);
    }, 10); // Esto fuerza a Angular a reconocer el cambio
  }

  deleteVideo(videoName: string, event: Event): void {
    event.stopPropagation();

    if (window.confirm('¿Estás seguro de que deseas eliminar este video?')) {
      this.fileService.deleteVideo(videoName).subscribe(() => {
        this.videos = this.videos.filter(v => v !== videoName);
        if (this.selectedVideoUrl === this.fileService.getVideoUrl(videoName)) {
          this.selectedVideoUrl = null;
        }
      }, error => console.error('Error deleting video:', error));
      window.location.reload();
    }
  }

  filterByCategory(category: string = '') {
    if (category) {
      // Si una categoría está seleccionada, filtra los videos basándote en esa categoría
      // Esto asume que la categoría es parte del nombre del video.
      this.filteredVideos = this.videos.filter(video => video.includes(category));
    } else {
      // Si no se seleccionó ninguna categoría, muestra todos los videos
      this.filteredVideos = [...this.videos];
    }
  }

setVideoUrl(videoName: string) {
    // Detiene y restablece cualquier video anterior
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
        this.videoPlayer.nativeElement.pause();
        this.videoPlayer.nativeElement.currentTime = 0;
    }

    this.selectedVideoUrl = this.fileService.getVideoUrl(videoName);

    // Actualiza el elemento source y recarga el video
    if (this.videoSource && this.videoSource.nativeElement) {
        this.videoSource.nativeElement.src = this.selectedVideoUrl;
        this.videoPlayer.nativeElement.load();
    }
}

}
