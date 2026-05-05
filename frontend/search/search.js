import { API_URL, renderBooks } from "../../lib/index.js";

const searchValue = document.getElementById("searchValue");
const searchInput = document.getElementById("searchInput");
const bookContainer = document.getElementById("book-container");
const logOut = document.getElementById("log-out");
const userProfile = document.querySelector(".userProfile");

document.addEventListener("DOMContentLoaded", async () => {
  const searchParams = window.location.href.split("?")[1];
  const search = decodeURIComponent(searchParams);

  if (search) {
    searchValue.innerText = search;
    const response = await fetch(`${API_URL}/search/${search}`);

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      if (result.data.length > 0) {
        const books = result.data;
        books.map((book) => {
          renderBooks(book, bookContainer);
        });
      } else {
        renderBooks(result.data, bookContainer);
      }
    }
  } else {
  }
});

searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const search = searchInput.value;
    searchValue.innerText = search;

    const response = await fetch(`${API_URL}/search/${search}`);

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      if (result.data.length > 0) {
        const books = result.data;
        books.map((book) => {
          renderBooks(book, bookContainer);
        });
      } else {
        renderBooks(result.data, bookContainer);
      }
    }
    // window.location.href = `/frontend/search/?${searchValue}`;
    console.log(searchInput.value);
  }
});

const openUserProfile = () => {
  if (userProfile.style.display === "none") {
    userProfile.style.display = "flex";
  } else {
    userProfile.style.display = "none";
  }
};

if (logOut) {
  logOut.addEventListener("click", () => {
    localStorage.removeItem("userSession");
    userProfile.style.display = "none";
    window.location.href = "/frontend/sign-in";
  });
}
