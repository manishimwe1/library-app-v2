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
const categorySelect = document.getElementById("category");

// Category modal elements
const categoryModal = document.getElementById("category-modal");
const addCategoryBtn = document.getElementById("add-category-btn");
const closeCategoryModalBtn = document.getElementById("close-category-modal");
const categoryForm = document.getElementById("category-form");
const saveCategoryBtn = document.getElementById("save-category");

const API_URL = "http://localhost:3000/api";
let currentBookId = null;
let categories = [];
let addedCategory;

function showEmptyState() {
  emptyState.classList.add("show");
  booksTable.style.display = "none";
}
function hideEmptyState() {
  emptyState.classList.remove("show");
  booksTable.style.display = "table";
}

// Load categories from API
async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      console.log("something went wrong getting categories");
      return;
    }
    categories = await response.json();
    populateCategorySelect();
  } catch (error) {
    console.log(error);
  }
}

// Populate category select dropdown
function populateCategorySelect() {
  categorySelect.innerHTML = '<option value="">Select a category</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
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
  const categoryId = document.getElementById("category").value;
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

    if (!categorySelect) {
      return console.log("no selected category", categorySelect);
    } else {

      // console.log(addedCategory);
      
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
            category: addedCategory,
          }),
        });

        if (response.ok) {
          submitForm.reset();
          modal.style.display = "none";
          loadBooks();
        }
      } catch (error) {
        console.log(error);
      }
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
  const categoryId = document.getElementById("category").value;

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
        category_id: categoryId,
      }),
    });

    if (response.ok) {
      submitForm.reset();
      modal.style.display = "none";
      loadBooks();
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) {
      console.log("something went wrong getting books");
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
      categorySelect.value = existingBook.category_id || "";

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
      console.log("error in deleting book",error);
    }
}

// Handle category form submission
async function handleCategorySubmit(e) {
  e.preventDefault();

  const categoryName = document.getElementById("category-name");
  const categoryDescription = document.getElementById(
    "category-description",
  ).value;


  addedCategory = categoryName.value;
  categoryForm.reset();
  categoryModal.style.display = "none";
  // try {
  //   const response = await fetch(`${API_URL}/categories`, {
  //     method: "POST",
  //     headers: {
  //       "CONTENT-TYPE": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name: categoryName,
  //       description: categoryDescription,
  //     }),
  //   });

  //   if (response.ok) {
  //     categoryForm.reset();
  //     categoryModal.style.display = "none";
  //     loadCategories();
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
}

// dislay modal
addBookBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  currentBookId = null;
  submitForm.reset();
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

saveBookBtn.addEventListener("click", handleBookSubmit);

// Category modal events
addCategoryBtn.addEventListener("click", () => {
  categoryModal.style.display = "flex";
});

closeCategoryModalBtn.addEventListener("click", () => {
  categoryModal.style.display = "none";
});

saveCategoryBtn.addEventListener("click", handleCategorySubmit);

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  loadCategories();
});
