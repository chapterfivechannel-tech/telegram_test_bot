const loginButton = document.getElementById("top-login");
const homeView = document.getElementById("home-view");
const gameView = document.getElementById("game-view");

if (!loginButton || !homeView || !gameView) {
  throw new Error("Cannot enable direct game entry: required Quizzy element is missing.");
}

loginButton.addEventListener("click", () => {
  homeView.style.display = "none";
  homeView.setAttribute("aria-hidden", "true");
  gameView.classList.add("is-visible");
  gameView.setAttribute("aria-hidden", "false");
});
