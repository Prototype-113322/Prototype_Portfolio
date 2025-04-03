"use strict";

// SELECTING ELEMENTS
let userName = document.querySelector("#name-text");
let emailAddress = document.querySelector("#email-text");
let messageContext = document.querySelector("#message-text");
let inputText = document.querySelectorAll(".input-text");
let errorMessage = document.querySelectorAll(".error-message");
let errorIconContainer = document.querySelectorAll(".error-icon-container");
let submitMessageButton = document.querySelector(".send-message");
const form = document.getElementById("form");
const result = document.getElementById("result");

/* OBSERVER API FOR SMOOTH TRANSITIONS */
//   SMOOTH SCROLL ANIMATION
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    });
  },
  {
    root: null, // Observes the viewport
    rootMargin: "0px",
    threshold: 0.2, // Trigger when 20% of the element is visible
  }
);

// Select all elements with the class "hidden"
const hiddenElements = document.querySelectorAll(".smooth-transition");
hiddenElements.forEach((el) => observer.observe(el));

/* FORM FUNCTIONALITY STARTS FROM HERE */

function emptyFieldErrorFunctionality() {
  let hasError = false;

  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i].value.trim().length === 0) {
      errorMessage[i].classList.remove("hidden");
      errorIconContainer[i].classList.remove("hidden");
      errorMessage[i].textContent = "Kindly, Enter Your Details";
      inputText[i].style.borderBottom = "1px solid hsl(7, 100%, 68%)";
      hasError = true; // PROVIDE US AN ERROR
    } else {
      errorMessage[i].classList.add("hidden");
      errorIconContainer[i].classList.add("hidden");
      inputText[i].style.borderBottom = "1px solid hsl(153, 71%, 59%)";
    }
  }

  return hasError;
}

function emailAddressFunctionality() {
  let email = emailAddress.value.trim();
  let verificationOfEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (verificationOfEmail.test(email)) {
    errorMessage[1].classList.add("hidden");
    errorIconContainer[1].classList.add("hidden");
    inputText[1].style.borderBottom = "1px solid hsl(153, 71%, 59%)";
    return false; // No error
  } else {
    errorMessage[1].textContent = "Invalid Email Format!";
    errorMessage[1].classList.remove("hidden");
    errorIconContainer[1].classList.remove("hidden");
    inputText[1].style.borderBottom = "1px solid hsl(7, 100%, 68%)";
    return true; // Email error
  }
}

// ✅ Check if elements exist before adding event listeners
submitMessageButton.addEventListener("click", function (e) {
  let fieldErrors = emptyFieldErrorFunctionality();
  let emailError = emailAddressFunctionality();

  if (fieldErrors || emailError) {
    e.preventDefault(); // Prevent submission if errors exist
  }
});

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let fieldErrors = emptyFieldErrorFunctionality();
    let emailError = emailAddressFunctionality();
    if (fieldErrors || emailError) return;

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    result.innerHTML = "Please wait...";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          result.innerHTML = "Form submitted successfully";
        } else {
          result.innerHTML = json.message;
        }
      })
      .catch((error) => {
        console.error(error);
        result.innerHTML = "Something went wrong!";
      })
      .finally(() => {
        form.reset();
        setTimeout(() => {
          result.style.display = "none";
        }, 3000);
      });
  });
} else {
  console.error("Form element not found!");
}
