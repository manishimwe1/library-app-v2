import { renderBooks } from "../lib/index.js";

const bookContainer = document.getElementById("book-container");
const navLink = document.getElementById("navLink");
const logOut = document.getElementById("log-out");
const profile = document.querySelector(".profile");
const userProfile = document.querySelector(".userProfile");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const searchValue = searchInput.value;

    window.location.href = `/frontend/search/?${searchValue}`;
  }
});

const API_URL = "http://localhost:3000/api";

function checkUserSession() {
  const session = localStorage.getItem("userSession");
  if (session) {
    const user = JSON.parse(session);
    console.log(user);

    profile.innerHTML = `
      <div class='user-btn' onclick='openUserProfile()'>${user.userName.charAt(0)}</div>
      <p class='user-name' onclick='openUserProfile()'>${user.userName}</p>
    
    `;
    return user;
  } else {
    window.location.href = "/frontend/sign-in/";
    return null;
  }
}

const openUserProfile = () => {
  if (userProfile.style.display === "none") {
    userProfile.style.display = "flex";
  } else {
    userProfile.style.display = "none";
  }
};

logOut.addEventListener("click", () => {
  localStorage.removeItem("userSession");
  userProfile.style.display = "none";
  window.location.href = "/frontend/sign-in";
});

const navLinks = [
  {
    label: "Home",
    active: true,
    link: "/",
  },
  {
    label: "Dashboard",
    active: false,
    link: "/frontend/dashboard/dashboard.html",
  },
  {
    label: "Books",
    active: false,
    link: "/books",
  },
  {
    label: "Add books",
    active: false,
    link: "/books",
  },
];

async function displayBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) {
      console.log("something went wrong in getting books");
      return;
    }

    const books = await response.json();
    books.map((book) => {
      renderBooks(book,bookContainer);
    });
  } catch (error) {
    console.log(error);
  }
}



function displayNavLinks() {
  navLinks.map((link, i) => {
    const navLinkElement = document.createElement("li");
    const navLinkHref = document.createElement("a");

    navLinkHref.innerText = `${link.label}`;
    navLinkHref.href = `${link.link}`;
    navLinkElement.className = "nav-link";
    navLinkElement.appendChild(navLinkHref);
    navLink.appendChild(navLinkElement);
  });
}

displayBooks();

displayNavLinks();
document.addEventListener("DOMContentLoaded", checkUserSession);
