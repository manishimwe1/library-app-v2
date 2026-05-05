const bookImage = document.getElementById("book-image");
const bookName = document.getElementById("bookName");
const bookDesc = document.getElementById("bookDesc");
const author = document.getElementById("author");
const date = document.getElementById("date");

const API_URL = "http://localhost:3000/api";

const paramsId = window.location.href.split("?")[1];

async function loadBook() {
  if (!paramsId) return console.log("missing id");

  const response = await fetch(`${API_URL}/books/${paramsId}`);
  if (response.ok) {
    const book = await response.json();

    bookName.innerText = book.name;
    bookDesc.innerText = book.description;
    author.innerText = book.author;
    const bookCover = document.createElement("img");
    bookCover.src = book.image;
    bookCover.alt = book.name;
    bookImage.appendChild(bookCover);
  }
}

document.addEventListener("DOMContentLoaded", loadBook);
