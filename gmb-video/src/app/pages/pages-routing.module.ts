import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-component/home.component';
import { FileUploadComponent } from './file-upload-component/file-upload.component';
import { VideosComponent } from './video-component/videos.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path:'videos',
        component:VideosComponent

      },
      {
        path: 'upload',
        component:FileUploadComponent
      },
      {
        path: '**',
        redirectTo: 'videos'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
