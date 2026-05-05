const modal = document.getElementById("modal");
const addBookBtn = document.getElementById("add-book-btn");
const closeBtn = document.getElementById("close-modal");
const submitForm = document.getElementById("submit-form");
const saveBookBtn = document.getElementById("add-book");
const booksTable = document.getElementById("books-table");
const tableBody = document.getElementById("table-body");
const emptyState = document.getElementById("emptyState");
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const authorInput = document.getElementById("author");
const priceInput = document.getElementById("price");

const API_URL = "http://localhost:3000/api";
let currentBookId = null;

function showEmptyState() {
  emptyState.classList.add("show");
  booksTable.style.display = "none";
}
function hideEmptyState() {
  emptyState.classList.remove("show");
  booksTable.style.display = "table";
}

// submit books
async function handleBookSubmit(e) {
  e.preventDefault();

  if (currentBookId !== null) {
    await handleUpdateBook(currentBookId);
    return;
  }

  const nameInput = document.getElementById("name").value;
  const descInput = document.getElementById("description").value;
  const authorInput = document.getElementById("author").value;
  const priceInput = document.getElementById("price").value;
  const imageSrc = document.getElementById("image");

  const file = imageSrc.files[0];
  if (!file) {
    console.log("no selected file");
    submitForm.disabled = false;
    return;
  }

  const reader = new FileReader();
  reader.onerror = function () {
    console.log("error reading filer", reader.error);
  };
  reader.onload = async function () {
    const imageSrc = reader.result;

    if (!imageSrc) {
      console.log("Error: imageSrc is null");
      submitForm.disabled = false;
      return;
    }

    try {
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "CONTENT-TYPE": "application/json",
        },
        body: JSON.stringify({
          name: nameInput,
          description: descInput,
          author: authorInput,
          price: priceInput,
          image: imageSrc,
        }),
      });

      if (response.ok) {
        submitForm.reset();
        modal.style.display = "none";
      }
    } catch (error) {
      console.log(error);
    }
  };

  reader.readAsDataURL(file);
}

async function handleUpdateBook(bookId) {
  submitForm.disabled = false;
  const nameInput = document.getElementById("name").value;
  const descInput = document.getElementById("description").value;
  const authorInput = document.getElementById("author").value;
  const priceInput = document.getElementById("price").value;

  try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "PUT",
        headers: {
          "CONTENT-TYPE": "application/json",
        },
        body: JSON.stringify({
          name: nameInput,
          description: descInput,
          author: authorInput,
          price: priceInput,
          // image: imageSrc,
        }),
      });

      if (response.ok) {
        submitForm.reset();
        modal.style.display = "none";
      }
    } catch (error) {
      console.log(error);
    }

}

async function loadBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) {
      console.log("something went wrong in getting books");
      return;
    }

    const books = await response.json();

    displayBooks(books);
  } catch (error) {
    console.log(error);
  }
}

function displayBooks(books) {
  tableBody.innerHTML = "";

  if (books.length === 0) {
    showEmptyState();
    return console.log("there is no books found");
  }
  hideEmptyState();
  books.forEach((book, index) => {
    const row = createTableRow(book, index);
    tableBody.appendChild(row);
  });
}

function createTableRow(book, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class='table-data'><strong>${index + 1}</strong></td>
    <td class='table-data' >${book.name}</td>
    <td class='table-data' >${book.author}</td>
    <td class='table-data' >${book.description}</td>
    <td class='table-data' >${book.price}</td>
    <td class='table-data' >
      <img src=${book.image} alt=${book.name} class='table-image'/>
    </td>
    <td>
      <div class='actions-cell'>
        <button class='action-btn'>View</button>
        <button class='action-btn' onclick='editBook(${book.id})'>Edit</button>
        <button class='action-btn btn-delete' onclick='deleteBook(${book.id})'>delete</button>
      </div>
    </td>
  `;

  return row;
}

async function editBook(bookId) {
  if (!bookId) {
    return console.log("missing book id");
  }

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`);

    if (response.ok) {
      modal.style.display = "flex";
      const existingBook = await response.json();
      nameInput.value = existingBook.name;
      descInput.value = existingBook.description;
      authorInput.value = existingBook.author;
      priceInput.value = existingBook.price;

      currentBookId = bookId;
    }
  } catch (error) {
    console.log(error);
  }
}

//delete books
async function deleteBook(bookId) {
  if (confirm("are you sure to delte this book"))
    try {
      if (!bookId) {
        return console.log("missing book id");
      }

      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("book deleted successfully");
        loadBooks();
      } else {
        alert("error in deleting book");
      }
    } catch (error) {
      console.log(error);
    }
}

// dislay modal
addBookBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

saveBookBtn.addEventListener("click", handleBookSubmit);

document.addEventListener("DOMContentLoaded", loadBooks);
