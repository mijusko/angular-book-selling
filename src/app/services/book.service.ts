import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { RequestBaseService } from "./request-base.service";
import { AuthenticationService } from "./authentication.service";
import { HttpClient } from "@angular/common/http";
import { Book } from "../models/book.model";
import { Observable } from "rxjs";

const API_URL = `https://book-selling-h5yb.onrender.com/api/book`;

@Injectable({
  providedIn: 'root'
})
export class BookService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  saveBook(book: Book, imageFile?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('book', new Blob([JSON.stringify(book)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }
    // Preuzmite headers, ali uklonite Content-Type jer Angular to postavlja automatski
    const headers = this.getHeaders.delete('Content-Type');
    return this.http.post(API_URL, formData, { headers });
  }


  deleteBook(book: Book): Observable<any> {
    return this.http.delete(`${API_URL}/${book.id}`, { headers: this.getHeaders });
  }

  getAllBooks(): Observable<any> {
    return this.http.get(API_URL);
  }
}
