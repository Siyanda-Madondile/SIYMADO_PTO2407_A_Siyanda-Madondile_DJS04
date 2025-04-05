// sets default theme
export const applyTheme = function (theme) {
    if (theme === "night") {
      document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty(
        "--color-light",
        "255, 255, 255"
      );
    }
  };
  
  // changes current theme
  export const changeTheme = function () {
    document
      .querySelector("[data-settings-form]")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
  
        applyTheme(theme);
        document.querySelector("[data-settings-overlay]").open = false;
      });
  };