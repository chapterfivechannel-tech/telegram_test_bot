const loginButton = document.getElementById("top-login");
const homeView = document.getElementById("home-view");
const gameView = document.getElementById("game-view");

loginButton?.addEventListener("click", () => {
  homeView.style.display = "none";
  homeView.setAttribute("aria-hidden", "true");
  gameView.classList.add("is-visible");
  gameView.setAttribute("aria-hidden", "false");
});
