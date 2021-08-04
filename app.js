class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks () {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList (book) {
    let list = document.querySelector('#book-list');
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const form = document.querySelector('#book-form');
    const container = document.querySelector('.container');
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector('.alert').remove(), 2000);

  }

  static darkMode() {  
    document.body.classList.add('dark');
    document.querySelector('table').classList.add('dark');
    let i = document.querySelector('i');
    i.classList.add('fa-sun');
    i.classList.add('dark');
    localStorage.setItem('darkTheme', 'true');
  }
  
  static lightMode() {  
    document.body.classList.remove('dark');
    document.querySelector('table').classList.remove('dark');
    let i = document.querySelector('i');
    i.classList.remove('fa-sun');
    i.classList.add('fa-moon');
    i.classList.remove('dark');
    localStorage.setItem('darkTheme', 'false')
  }
 
  static clearFields(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

}

class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books)); 
  }
}


//       Displaying Books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

//      Get values from user
document.querySelector('#book-form').addEventListener('submit', (e) => 
{
  e.preventDefault();
  let title = document.querySelector('#title').value;
  let author = document.querySelector('#author').value;
  let isbn = document.querySelector('#isbn').value;

  if(title === '' || author === '' || isbn === ''){
    UI.showAlert('Please fill all fields!', 'danger');
  
  } else {

    UI.showAlert('Book successfully added!', 'success'); 
    let book = new Book(title, author, isbn);
    
    // adding book to UI
    UI.addBookToList(book);
    
    // adding book to local Storage
    Store.addBook(book);

    UI.clearFields();
  }
});

//        Delete Book by clicking the delete button

document.querySelector('#book-list').addEventListener('click', (e) => {
  e.preventDefault();
  UI.deleteBook(e.target);
  UI.showAlert('Book deleted!', 'success')

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  
});

//   Dark mode

document.querySelector('.btn-dm').addEventListener('click', (e) => {
  let theme = localStorage.getItem('darkTheme');
  if(theme == 'true'){
    UI.lightMode(); 
  } else {
    UI.darkMode();
  }
});

window.onload = () => {
  if (localStorage.getItem("darkTheme") == 'true') {
      UI.darkMode();
  } else {
      UI.lightMode();
  }
}



