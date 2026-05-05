const submitForm = document.getElementById("submitForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const message = document.getElementById("message");
const eye = document.querySelector('.eye');

const API_URL = "http://localhost:3000/api";
 

eye.addEventListener('click',()=>{
  if(passwordInput.type === 'password'){
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
})

emailInput.addEventListener('focus',()=>{
    message.innerText = ''
})

async function handleSignUp(e) {
  e.preventDefault();

  const userName = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPass = confirmPasswordInput.value;

  if (password !== confirmPass) {
    return alert("password does not match");
  }

  try {
    const response = await fetch(`${API_URL}/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        email,
        password,
      }),
    });
    if (response.ok) {
      window.location.href = "/frontend/sign-in";
    } else {
      const data = await response.json();
      message.innerText = data.message;
    }
  } catch (error) {
    console.log(error);
  }
}

submitForm.addEventListener("submit", handleSignUp);
