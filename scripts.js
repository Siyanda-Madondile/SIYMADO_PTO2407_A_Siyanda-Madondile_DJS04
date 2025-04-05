import { books, authors, genres, BOOKS_PER_PAGE } from "./sources/data.js";
import {
  renderBooks,
  setupDropdowns,
  setInitialTheme,
  loadMoreBooks,
  updateShowMoreButton,
  updateShowMoreButtonText,
  displayBookDetails,
  setupSearchOverlayToggle,
  setupSettingsOverlayToggle,
  setupSearchOverlayClose,
  setupSettingsOverlayClose,
  setupBookDetailsOverlayClose,
} from "./sources/ui.js";
import { changeTheme } from "./sources/settings.js";
import { updateSearchDisplay } from "./sources/search.js";

// tracks the current page from 1
let page = 1;
// initialising the list of matched books, showing all books from the start of the load
let matches = books;

// initial book display for page and drop downs for filtering
renderBooks(matches.slice(0, BOOKS_PER_PAGE));
setupDropdowns(genres, authors);

//overlay toggles
setupSearchOverlayToggle();
setupSearchOverlayClose();
setupSettingsOverlayToggle();
setupSettingsOverlayClose();
setupBookDetailsOverlayClose();

// theme management
setInitialTheme();
changeTheme();

// filter and display the filtered books on the page
updateSearchDisplay(books, authors, page, BOOKS_PER_PAGE);

// loads extra books when (Show more) button is clicked and updates the text in the button
const listButton = document.querySelector("[data-list-button]");
const listContainer = document.querySelector("[data-list-items]");

updateShowMoreButtonText(listButton, matches, page, BOOKS_PER_PAGE); // updates the text

document.querySelector("[data-list-button]").addEventListener("click", () => {
  loadMoreBooks(matches, page, BOOKS_PER_PAGE, authors, listContainer);
  page += 1;
  updateShowMoreButton(listButton, matches, page, BOOKS_PER_PAGE);
});

// shows book details in an overlay when a book preview is clicked
document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    displayBookDetails(event, books, authors);
  });