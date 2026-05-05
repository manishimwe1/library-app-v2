const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitForm = document.getElementById("submitForm");
const message = document.getElementById("message");
const eye = document.querySelector('.eye');

eye.addEventListener('click',()=>{
  if(passwordInput.type === 'password'){
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
})

const API_URL = "http://localhost:3000/api";

document.addEventListener('DOMContentLoaded',()=>{
  const session = localStorage.getItem('userSession');
  if(session){
    window.location.href = '/frontend/'
  }
})

async function handleSignIn(e) {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  const response = await fetch(`${API_URL}/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    const userData = await response.json();
    console.log(userData);

    localStorage.setItem(
      "userSession",
      JSON.stringify({
        userId: userData.user.id,
        email: userData.user.email,
        userName: userData.user.userName,
      }),
    );

    window.location.href = "/frontend/";
  } else {
    const data = await response.json();
    message.innerText = data.message;
  }
}

submitForm.addEventListener("submit", handleSignIn);
