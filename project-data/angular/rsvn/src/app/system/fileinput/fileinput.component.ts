import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AppEnv } from '@app/_helpers/appenv';

@Component({
  selector: 'app-fileinput',
  templateUrl: './fileinput.component.html',
  styleUrls: ['./fileinput.component.css']
})
export class FileinputComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private env: AppEnv 

  ) { }

  private urlRoot = `${this.env.WEB_API}`

  fileName = '';

  @Output()  results  = new EventEmitter<any>();

  onFileSelected(event:any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
     
      formData.append("file", file);

      const upload$ = this.http.post(`${this.urlRoot}/filein/`, formData);
      upload$.subscribe(
        data => {
          this.results.emit(data)
          console.log("File Peek",data)
        }
      );
    }
  }







  ngOnInit(): void {
  }

}
