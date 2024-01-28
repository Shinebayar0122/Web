//json-1
function fetchAndDisplayAuthors() {
    fetch('authors.json')
        .then(response => response.json())
        .then(authorsData => {
            const authorContainer = document.getElementById("authorContainer");
            authorsData.forEach(author => {
                const authorElement = document.createElement("div");
                authorElement.classList.add("author");
  
                authorElement.innerHTML = `
                    <img src="${author.pic}" style="width: 25rem">
                    <article class="NyamNyam">
                        <h3>${author.name}</h3>
                        <p>Birthdate: ${author.birthdate}</p>
                        <p>Country: ${author.country}</p>
                    </article>
                `;
                authorContainer.appendChild(authorElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
fetchAndDisplayAuthors();


//json-2
document.addEventListener('DOMContentLoaded', function () {
    const jsonUrl = 'https://api.jsonbin.io/v3/b/65aeffa3266cfc3fde7e3427/latest';
    let booksData;
    let currentCategory = '';
    let currentSortBy = '';

    function displaySearchResults(searchResults) {
        const searchResultsContainer = document.querySelector('.search-results');
        const searchList = document.createElement('ul');
        searchList.className = 'search-list';
    
        searchResults.forEach(result => {
            const listItem = document.createElement('li');
            listItem.className = 'search-list-item';
            listItem.innerHTML = `<p>${result.name} - ${result.author}</p>`;
            searchList.appendChild(listItem);
        });
        const searchInput = document.getElementById('search-bar');
        searchInput.addEventListener('focus', function () {
            searchList.style.display = 'block';
        });
        searchInput.addEventListener('blur', function () {
            setTimeout(() => {
                searchList.style.display = 'none';
            }, 200);
        });
        searchResultsContainer.innerHTML = '';
        searchResultsContainer.appendChild(searchList);
    }

    function fetchAndDisplayBooks(category = '', sortBy = '', filterBooks = []) {
        const bookList = document.querySelector('.book-list');
        bookList.innerHTML = '';

        const booksToDisplay = filterBooks.length > 0 ? filterBooks : booksData.record;

        currentCategory = category;

        let sortedBooks = [...booksToDisplay];

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
            const bookElement = document.createElement('article');
            bookElement.className = 'book';
            bookElement.innerHTML = `
                <img src="${book.pic}" alt="${book.name}">
                <h3>${book.name}</h3>
                <p>Зохиолч: ${book.author}</p>
                <p>Үнэ: ${book.price.toFixed(2)}₮</p>
                <a href="#" class="btn">Сагсанд хийх</a>
            `;
            bookList.appendChild(bookElement);
        });

        displaySearchResults(filterBooks);
    }

    function handleSortButtonClick(sortBy) {
        currentSortBy = sortBy;
        fetchAndDisplayBooks(currentCategory, currentSortBy);
    }

    function handleSidebarItemClick(category) {
        const sidebar = document.querySelector('.sidebar');
        const mainSection = document.querySelector('section');

        sidebar.classList.remove('active');
        mainSection.style.marginRight = '0';

        fetchAndDisplayBooks(category, currentSortBy);
    }

    const categoryButton = document.getElementById('categoryButton');
    categoryButton.addEventListener('click', function () {
        const sidebar = document.querySelector('.sidebar');
        const mainSection = document.querySelector('section');

        sidebar.classList.toggle('active');
        mainSection.style.marginRight = sidebar.classList.contains('active') ? '20%' : '0';
    });

    const sidebarItems = document.querySelectorAll('.sidebar ul li a');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedCategory = item.textContent.trim();
            handleSidebarItemClick(selectedCategory);
        });
    });

    const sortButtons = document.querySelectorAll('nav ul li a');
    sortButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const sortBy = button.textContent.trim();
            handleSortButtonClick(sortBy);
        });
    });

    const searchInput = document.getElementById('search-bar');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredBooks = booksData.record.filter(book =>
            book.name.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );

        fetchAndDisplayBooks(currentCategory, currentSortBy, filteredBooks);
    });

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            booksData = data;
            fetchAndDisplayBooks();
        })
        .catch(error => console.error('Error fetching data:', error));
});
