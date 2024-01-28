//json-1
class Author {
    constructor(id, name, about, birthdate, country, pic) {
        this.id = id;
        this.name = name;
        this.about = about;
        this.birthdate = birthdate;
        this.country = country;
        this.pic = pic;
    }

    createAuthorElement() {
        const authorElement = document.createElement("div");
        authorElement.classList.add("author");

        authorElement.innerHTML = `
            <img src="${this.pic}" style="width: 25rem">
            <article class="NyamNyam">
                <h3>${this.name}</h3>
                <p>Birthdate: ${this.birthdate}</p>
                <p>Country: ${this.country}</p>
            </article>
        `;

        return authorElement;
    }
}
function fetchAndDisplayAuthors() {
    fetch('authors.json')
        .then(response => response.json())
        .then(authorsData => {
            const authorContainer = document.getElementById("authorContainer");

            authorsData.forEach(authorData => {
                const author = new Author(
                    authorData.id,
                    authorData.name,
                    authorData.about,
                    authorData.birthdate,
                    authorData.country,
                    authorData.pic
                );

                const authorElement = author.createAuthorElement();
                authorContainer.appendChild(authorElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
fetchAndDisplayAuthors();


//json-2
class Book {
    constructor(name, author, price, category, ov_rating, pic) {
        this.name = name;
        this.author = author;
        this.price = price;
        this.category = category;
        this.ov_rating = ov_rating;
        this.pic = pic;
    }
}

class BookApp {
    constructor(jsonUrl) {
        // State variables
        this.booksData = null;
        this.currentCategory = '';
        this.currentSortBy = '';

        // DOM elements
        this.bookList = document.querySelector('.book-list');
        this.searchResultsContainer = document.querySelector('.search-results');
        this.searchInput = document.getElementById('search-bar');
        this.categoryButton = document.getElementById('categoryButton');
        this.sidebar = document.querySelector('.sidebar');
        this.sidebarItems = document.querySelectorAll('.sidebar ul li a');
        this.sortButtons = document.querySelectorAll('nav ul li a');

        // Constants
        this.jsonUrl = jsonUrl;

        // Event listeners
        document.addEventListener('DOMContentLoaded', () => this.init());
        this.categoryButton.addEventListener('click', () => this.toggleSidebar());
        this.sidebarItems.forEach(item => item.addEventListener('click', event => this.handleSidebarItemClick(event)));
        this.sortButtons.forEach(button => button.addEventListener('click', event => this.handleSortButtonClick(event)));
        this.searchInput.addEventListener('input', () => this.handleSearchInput());
        window.addEventListener('popstate', () => this.fetchAndDisplayBooksFromURL());
    }

    init() {
        this.fetchData();
    }

    fetchData() {
        fetch(this.jsonUrl)
            .then(response => response.json())
            .then(data => {
                this.booksData = data;
                this.fetchAndDisplayBooksFromURL();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    createBookElement(book) {
        const bookElement = document.createElement('article');
        bookElement.className = 'book';
        bookElement.innerHTML = `
            <img src="${book.pic}" alt="${book.name}">
            <h3>${book.name}</h3>
            <p>Зохиолч: ${book.author}</p>
            <p>Үнэ: ${book.price.toFixed(2)}₮</p>
            <a href="#" class="btn">Сагсанд хийх</a>
        `;
        return bookElement;
    }

    displaySearchResults(searchResults) {
        const searchList = document.createElement('ul');
        searchList.className = 'search-list';

        searchResults.forEach(result => {
            const listItem = document.createElement('li');
            listItem.className = 'search-list-item';
            listItem.innerHTML = `<p>${result.name} - ${result.author}</p>`;
            searchList.appendChild(listItem);
        });

        this.searchResultsContainer.innerHTML = '';
        this.searchResultsContainer.appendChild(searchList);
    }

    fetchAndDisplayBooks(category = '', sortBy = '', filterBooks = []) {
        this.bookList.innerHTML = '';

        const booksToDisplay = filterBooks.length > 0 ? filterBooks : this.booksData.record;

        this.currentCategory = category;

        let sortedBooks = [...booksToDisplay];

        if (this.currentCategory) {
            sortedBooks = sortedBooks.filter(book => book.category.toLowerCase() === this.currentCategory.toLowerCase());
        }

        if (sortBy === 'Үсгийн дарааллаар') {
            sortedBooks.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'Үнээр(Өсөхөөр)') {
            sortedBooks.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'Үнээр(Буурах)') {
            sortedBooks.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'Үнэлгээгээр') {
            sortedBooks.sort((a, b) => b.ov_rating - a.ov_rating);
        }

        sortedBooks.forEach(book => {
            const bookElement = this.createBookElement(book);
            this.bookList.appendChild(bookElement);
        });

        this.displaySearchResults(filterBooks);
    }

    handleSortButtonClick(event) {
        const sortBy = event.target.textContent.trim();
        this.currentSortBy = sortBy;
        this.updateURLParams();
        this.fetchAndDisplayBooks(this.currentCategory, this.currentSortBy);
    }

    handleSidebarItemClick(event) {
        event.preventDefault();
        const selectedCategory = event.target.textContent.trim();
        this.sidebar.classList.remove('active');
        document.querySelector('section').style.marginRight = '0';
        this.currentCategory = selectedCategory;
        this.updateURLParams();
        this.fetchAndDisplayBooks(this.currentCategory, this.currentSortBy);
    }

    handleSearchInput() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        const filteredBooks = this.booksData.record.filter(book =>
            (this.currentCategory ? book.category.toLowerCase() === this.currentCategory.toLowerCase() : true) &&
            (book.name.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm))
        );

        this.fetchAndDisplayBooks(this.currentCategory, this.currentSortBy, filteredBooks);
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('active');
        document.querySelector('section').style.marginRight = this.sidebar.classList.contains('active') ? '20%' : '0';
    }

    updateURLParams() {
        const params = new URLSearchParams();
        if (this.currentCategory) params.set('category', this.currentCategory);
        if (this.currentSortBy) params.set('sortBy', this.currentSortBy);

        const newURL = window.location.pathname + '?' + params.toString();
        window.history.pushState({}, '', newURL);
    }

    getURLParams() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const sortBy = params.get('sortBy');
        return { category, sortBy };
    }

    fetchAndDisplayBooksFromURL() {
        const { category, sortBy } = this.getURLParams();
        this.fetchAndDisplayBooks(category, sortBy);
    }
}

// Instantiate the BookApp class
const bookApp = new BookApp('https://api.jsonbin.io/v3/b/65aeffa3266cfc3fde7e3427/latest');
