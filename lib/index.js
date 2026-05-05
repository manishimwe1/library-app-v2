const logOut = document.getElementById("log-out");
const userProfile = document.querySelector(".userProfile");


export const API_URL = "http://localhost:3000/api";

export const renderBooks = (book,bookContainer) => {
  const bookElement = document.createElement("div");
  const bookCard = document.createElement("div");

  const bookImage = document.createElement("img");
  const bookName = document.createElement("h2");
  const bookAuthor = document.createElement("p");
  const bookDescription = document.createElement("p");
  const bookPrice = document.createElement("p");
  const bookSpan = document.createElement("span");

  bookImage.src = book.image;
  bookName.textContent = book.name;
  bookAuthor.textContent = `Author: ${book.author}`;
  bookDescription.textContent = book.description;
  bookPrice.textContent = `Price: `;
  bookSpan.textContent = `$${book.price.toFixed(2)}`;

  bookElement.className = "book-element";
  bookName.className = "book-title";
  bookAuthor.className = "book-author";
  bookDescription.className = "book-desc";
  bookPrice.className = "book-price";
  bookImage.className = "bookImage";
  bookCard.className = "book-card";
  bookSpan.className = "book-span-price";

  bookElement.appendChild(bookImage);
  bookCard.appendChild(bookName);
  bookCard.appendChild(bookAuthor);
  bookCard.appendChild(bookDescription);
  bookCard.appendChild(bookPrice);
  bookPrice.appendChild(bookSpan);

  bookElement.appendChild(bookCard);
  bookContainer.appendChild(bookElement);

  bookElement.addEventListener("click", () => {
    viewBook(book.id);
  });
};

export function viewBook(booId) {
  if (!booId) {
    return console.log("missing book id");
  }

  window.location.href = `/frontend/view/?${booId}`;
}

const openUserProfile = () => {
    console.log('here');
    
  if (userProfile.style.display === "none") {
    userProfile.style.display = "flex";
  } else {
    userProfile.style.display = "none";
  }
};

export function checkUserSession(profile) {
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



