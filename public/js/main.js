//Menu

const closed = document.getElementById("closed");
const open = document.getElementById("open");
const mobileNav = document.getElementById("mobile-nav");

closed.addEventListener("click", () => {
  mobileNav.classList.toggle("_closed");
  open.style.display = "block";
  closed.style.display = "none";
});

open.addEventListener("click", () => {
  mobileNav.classList.toggle("_closed");
  open.style.display = "none";
  closed.style.display = "block";
});
