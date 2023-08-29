import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  uploadVideo(file: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('video', file, file.name);

    const clientId = new Date().getTime().toString(); 
    const headers = new HttpHeaders({
        'X-Client-ID': clientId
    });

    return new Observable(observer => {
        // Start listening to SSE events
        const eventSource = new EventSource(`${this.baseUrl}/progress/${clientId}`);

        eventSource.onmessage = (event) => {
            const progress = parseFloat(event.data);
            observer.next(progress);
            if (progress === 100) {
                observer.complete();
                eventSource.close();
            }
        };

        // Start the upload
        this.http.post(`${this.baseUrl}/upload`, formData, { headers, responseType: 'text' }).subscribe(
            () => {},
            error => observer.error(error)
        );
    });
}

getVideoUrl(videoName: string): string {
  return `${this.baseUrl}/video/${videoName}`; 
}

getVideos(): Observable<string[]> {
  const videosUrl =`${this.baseUrl}/videos`;
  return this.http.get<string[]>(videosUrl);
}

deleteVideo(videoName: string): Observable<void> {
  const url = `${this.baseUrl}/video/${videoName}`;
  return this.http.delete<void>(url);
}
}