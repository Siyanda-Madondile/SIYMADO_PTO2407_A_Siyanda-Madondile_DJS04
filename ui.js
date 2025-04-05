import { authors, BOOKS_PER_PAGE } from "./data.js";
import "./Components/BookPreview.js";

// tracks the current page from 1
let page = 1;
// list of books to display
let matches = [];

// create and display the initial set of books in preview
export const renderBooks = function (displayedBooks) {
  const starting = document.createDocumentFragment();
  for (const { author, id, image, title } of displayedBooks) {
    const element = document.createElement("book-preview");
    element.setAttribute("image", image);
    element.setAttribute("title", title);
    element.setAttribute("author", authors[author]);
    element.setAttribute("id", id);

    starting.appendChild(element);
  }

  document.querySelector("[data-list-items]").appendChild(starting);
};

// creates the drop down list for genre and authors
export const setupDropdowns = function (genres, authors) {
  const genreHtml = document.createDocumentFragment();
  const firstGenreElement = document.createElement("option");
  firstGenreElement.value = "any";
  firstGenreElement.innerText = "All Genres";
  genreHtml.appendChild(firstGenreElement);

  for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    genreHtml.appendChild(element);
  }

  document.querySelector("[data-search-genres]").appendChild(genreHtml);

  const authorsHtml = document.createDocumentFragment();
  const firstAuthorElement = document.createElement("option");
  firstAuthorElement.value = "any";
  firstAuthorElement.innerText = "All Authors";
  authorsHtml.appendChild(firstAuthorElement);

  for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    authorsHtml.appendChild(element);
  }

  document.querySelector("[data-search-authors]").appendChild(authorsHtml);
};

/**
 *
 * Overlays open/close
 *
 */

//closes any overlay in the argument
export const closeOverlay = function (overlay) {
  document.querySelector(overlay).open = false;
};

// opens any overlay in the argument
export const openOverlay = function (overlay) {
  document.querySelector(overlay).open = true;
};

// loads the theme according to the user preferences
export const setInitialTheme = function () {
  const themeElement = document.querySelector("[data-settings-theme]");

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    themeElement.value = "night";
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    themeElement.value = "day";
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }
};

/**
 *
 * Book details overlay
 *
 */

// shows book details in an overlay when a book preview is clicked
export const displayBookDetails = function (event, books, authors) {
  document
    .querySelector("[data-list-items]")
    .addEventListener("click", (event) => {
      const pathArray = Array.from(event.path || event.composedPath());
      let active = null;

      for (const node of pathArray) {
        if (active) break;

        if (node?.dataset?.preview) {
          let result = null;

          for (const singleBook of books) {
            if (result) break;
            if (singleBook.id === node?.dataset?.preview) result = singleBook;
          }

          active = result;
        }
      }

      if (active) {
        document.querySelector("[data-list-active]").open = true;
        document.querySelector("[data-list-blur]").src = active.image;
        document.querySelector("[data-list-image]").src = active.image;
        document.querySelector("[data-list-title]").innerText = active.title;
        document.querySelector("[data-list-subtitle]").innerText = `${
          authors[active.author]
        } (${new Date(active.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerText =
          active.description;
      }
    });
};

/**
 *
 * Overlay Toggles
 *
 */

// Opens the search overlay and focuses the search input
export const setupSearchOverlayToggle = function () {
  document
    .querySelector("[data-header-search]")
    .addEventListener("click", () => {
      openOverlay("[data-search-overlay]");
      document.querySelector("[data-search-title]").focus();
    });
};

// closes the search overlay when the cancel button is clicked
export const setupSearchOverlayClose = function () {
  document
    .querySelector("[data-search-cancel]")
    .addEventListener("click", () => {
      closeOverlay("[data-search-overlay]");
    });
};

// opens the settings overlay
export const setupSettingsOverlayToggle = function () {
  document
    .querySelector("[data-header-settings]")
    .addEventListener("click", () => {
      openOverlay("[data-settings-overlay]");
    });
};

// closes the settings overlay when the cancel button is clicked
export const setupSettingsOverlayClose = function () {
  document
    .querySelector("[data-settings-cancel]")
    .addEventListener("click", () => {
      closeOverlay("[data-settings-overlay]");
    });
};

// closes the book details overlay when the close button is clicked
export const setupBookDetailsOverlayClose = function () {
  document.querySelector("[data-list-close]").addEventListener("click", () => {
    closeOverlay("[data-list-active]");
  });
};

/**
 *
 * Load more books on the page
 *
 */

// Loads additional books and appends them to the list
export const loadMoreBooks = function (
  matches,
  page,
  BOOKS_PER_PAGE,
  authors,
  listContainer
) {
  const fragment = document.createDocumentFragment();
  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = document.createElement("book-preview");
    element.setAttribute("image", image);
    element.setAttribute("title", title);
    element.setAttribute("author", authors[author]);
    element.setAttribute("id", id);
    fragment.appendChild(element);
  }
  listContainer.appendChild(fragment);
};

// updates the (Show more) button and enables/disables it based on the remaining books
export function updateShowMoreButton(button, matches, page, BOOKS_PER_PAGE) {
  const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
  button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          remainingBooks > 0 ? remainingBooks : 0
        })</span>
    `;
  button.disabled = remainingBooks <= 0;
}

// updates the (Show more) button text based on remaining books
export function updateShowMoreButtonText(
  button,
  matches,
  page,
  BOOKS_PER_PAGE
) {
  const remainingBooks =
    matches.length - page * BOOKS_PER_PAGE > 0
      ? matches.length - page * BOOKS_PER_PAGE
      : 0;
  button.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${remainingBooks})</span>
    `;
}