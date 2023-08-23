import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  videos: string[] = [];

  constructor(
    private fileService : FileService
  ) { }

  ngOnInit(): void {
    this.fileService.getVideos().subscribe(
      videos => this.videos = videos,
      error => console.error('Error fetching videos:', error)
  );
  }

  selectedVideo: string | null = null;
  selectedVideoUrl: string | null = null;
  
  playVideo(videoName: string) {
    this.selectedVideoUrl = this.fileService.getVideoUrl(videoName);
    
    // Ahora muestra el reproductor de video
}
}
