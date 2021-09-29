import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}; 

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(
    private env: AppEnv ,
    private http: HttpClient
  ) { }

  private urlRoot = `${this.env.WEB_API}` 

  
  getItemList(base:string,): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.urlRoot}/${base}/`)
  }

  getItem(base:string,item:any): Observable<any> {
    return this.http
      .get<any>(`${this.urlRoot}/${base}/${item}/`)
  }
 
  updateItem(base:string,item:any) :Observable<any> {
    if(item.id) {
      return this.http.put<any>(`${this.urlRoot}/${base}/${item.id}/` , item, httpOptions)
    } else {
      return this.http.post<any>(`${this.urlRoot}/${base}/`,item, httpOptions)
    }
  }
  deleteItem(base:string,item:any) :Observable<any> {
    return this.http.delete<any>(`${this.urlRoot}/${base}/${item.id}/`)
  }


}







