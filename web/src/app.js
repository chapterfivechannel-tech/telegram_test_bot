const loginButton = document.getElementById("top-login");
const loginStatus = document.getElementById("login-status");
const homeView = document.getElementById("home-view");
const accountView = document.getElementById("account-view");
const accountUserLabel = document.getElementById("account-user-label");

const telegram = window.Telegram?.WebApp;

if (telegram) {
  telegram.ready();
  telegram.expand();
}

loginButton.addEventListener("click", async () => {
  if (!telegram?.initData) {
    loginStatus.textContent = "برای ورود، این صفحه را از داخل ربات تلگرام باز کنید.";
    return;
  }

  loginButton.disabled = true;
  loginStatus.textContent = "در حال بررسی اطلاعات تلگرام…";

  try {
    const response = await fetch("https://chapterfivechannel.pythonanywhere.com/telegram-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData: telegram.initData }),
    });
    const result = await response.json();

    if (!response.ok || !result.ok || !result.user) {
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    const displayName = result.user.first_name || result.user.username || "کاربر";
    accountUserLabel.textContent = `حساب من · ${displayName}`;
    homeView.style.display = "none";
    homeView.setAttribute("aria-hidden", "true");
    accountView.classList.add("is-visible");
    accountView.setAttribute("aria-hidden", "false");
  } catch (error) {
    console.error("Telegram login failed:", error);
    loginStatus.textContent = "ورود انجام نشد. اتصال اینترنت و تنظیمات backend را بررسی کنید و دوباره تلاش کنید.";
  } finally {
    loginButton.disabled = false;
  }
});
