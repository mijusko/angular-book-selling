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

  // Skladištimo fajl koji korisnik odabere
  selectedFile: File | null = null;

  constructor(private bookService: BookService) { }

  saveBook() {
    this.bookService.saveBook(this.book, this.selectedFile ?? undefined).subscribe(data => {
      this.save.emit(data);
      $('#bookModal').modal('hide');
      // Resetujemo fajl i sliku nakon sačuvavanja
      this.selectedFile = null;
      this.book.image = undefined;
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
      this.selectedFile = file; // sačuvaj fajl za upload
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Za preview: uzmi Base64 deo Data URL-a
        this.book.image = e.target.result.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.book.image = undefined;
  }
}
