import { Component, OnInit } from '@angular/core';
import { Book } from "../../models/book.model";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationService } from "../../services/authentication.service";
import { BookService } from "../../services/book.service";
import { PurchaseService } from "../../services/purchase.service";
import { Purchase } from "../../models/purchase.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  bookList: Book[] = [];
  faBook = faBook;
  errorMessage: string = "";
  infoMessage: string = "";

  // Pretraga i sortiranje – podrazumevano sortiranje je po naslovu
  searchTerm: string = "";
  // Mogućnosti sortiranja: 'title', 'author', 'priceAsc', 'priceDesc'
  sortField: string = "title";

  constructor(
    private authenticationService: AuthenticationService,
    private bookService: BookService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe(data => {
      this.bookList = data;
    }, err => {
      this.errorMessage = 'Error loading books.';
      console.log(err);
    });
  }

  // Getter za filtrirane i sortirane knjige
  get filteredBooks(): Book[] {
    let filtered = this.bookList;

    // Filtriranje po searchTerm
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.description.toLowerCase().includes(term)
      );
    }

    // Sortiranje
    if (this.sortField) {
      filtered = filtered.sort((a, b) => {
        switch (this.sortField) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'author':
            return a.author.localeCompare(b.author);
          case 'priceAsc':
            return a.price - b.price;
          case 'priceDesc':
            return b.price - a.price;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }

  purchase(item: Book) {
    if (!this.authenticationService.currentUserValue?.id) {
      this.errorMessage = 'You should log in to buy a book';
      return;
    }
    const purchase = new Purchase(
      this.authenticationService.currentUserValue.id,
      item.id,
      item.price
    );
    this.purchaseService.savePurchase(purchase).subscribe(data => {
      this.infoMessage = 'Mission is completed';
    }, err => {
      this.errorMessage = 'Unexpected error occurred.';
      console.log(err);
    });
  }
}
