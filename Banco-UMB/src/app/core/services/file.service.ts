import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = 'http://localhost:3000/upload';
  
  constructor(private http: HttpClient) { }

  uploadVideo(file: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('video', file, file.name);

    const clientId = new Date().getTime().toString();  // This is a simple client ID generator. In a real-world scenario, you might want a more complex ID.
    const headers = new HttpHeaders({
        'X-Client-ID': clientId
    });

    return new Observable(observer => {
        // Start listening to SSE events
        const eventSource = new EventSource(`http://localhost:3000/progress/${clientId}`);

        eventSource.onmessage = (event) => {
            const progress = parseFloat(event.data);
            observer.next(progress);
            if (progress === 100) {
                observer.complete();
                eventSource.close();
            }
        };

        // Start the upload
        this.http.post(this.apiUrl, formData, { headers, responseType: 'text' }).subscribe(
            () => {},
            error => observer.error(error)
        );
    });
}

getVideoUrl(videoName: string): string {
  return `http://localhost:3000/video/${videoName}`; // Ajuste en la ruta
}

getVideos(): Observable<string[]> {
  const videosUrl = 'http://localhost:3000/videos';
  return this.http.get<string[]>(videosUrl);
}
}