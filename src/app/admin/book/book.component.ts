import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Book } from "../../models/book.model";
import { BookService } from "../../services/book.service";
import { faBook, faTimes } from "@fortawesome/free-solid-svg-icons";

declare var $: any;

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {

  errorMessage: string = "";

  @Input() book: Book = new Book();
  @Output() save = new EventEmitter<any>();

  faBook = faBook;
  faTimes = faTimes;

  constructor(private bookService: BookService) { }

  saveBook() {
    this.bookService.saveBook(this.book).subscribe(data => {
      this.save.emit(data);
      $('#bookModal').modal('hide');
    }, err => {
      this.errorMessage = 'Unexpected error occurred.';
      console.log(err);
    });
  }

  showBookModal() {
    $('#bookModal').modal('show');
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // e.target.result je Data URL, iz njega uzimamo samo Base64 deo
        const base64Result = e.target.result.split(',')[1];
        this.book.image = base64Result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.book.image = undefined;
  }
}
