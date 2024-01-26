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
document.addEventListener('DOMContentLoaded', function () {
    const jsonUrl = 'https://api.jsonbin.io/v3/b/65aeffa3266cfc3fde7e3427/latest';
    let booksData;

    function fetchAndDisplayBooks(category = '', sortBy = '') {
        const bookList = document.querySelector('.book-list');
        bookList.innerHTML = '';

        const filteredBooks = category
            ? booksData.record.filter(book => book.category === category)
            : booksData.record;

        let sortedBooks = [...filteredBooks];

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
    }

    function handleSidebarItemClick(category) {
        const sidebar = document.querySelector('.sidebar');
        const mainSection = document.querySelector('section');

        sidebar.classList.remove('active');
        mainSection.style.marginRight = '0';

        fetchAndDisplayBooks(category);
    }

    function getActiveCategory() {
        const activeCategory = document.querySelector('.sidebar ul li a.active');
        return activeCategory ? activeCategory.textContent.trim() : '';
    }

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

    function handleSortButtonClick(sortBy) {
        const category = getActiveCategory();
        fetchAndDisplayBooks(category, sortBy);
    }

    const categoryButton = document.getElementById('categoryButton');
    categoryButton.addEventListener('click', function () {
        const sidebar = document.querySelector('.sidebar');
        const mainSection = document.querySelector('section');

        sidebar.classList.toggle('active');
        mainSection.style.marginRight = sidebar.classList.contains('active') ? '20%' : '0';
    });

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            booksData = data;
            fetchAndDisplayBooks();
        })
        .catch(error => console.error('Error fetching data:', error));
});

