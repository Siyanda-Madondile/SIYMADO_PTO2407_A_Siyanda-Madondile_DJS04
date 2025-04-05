//filter all the books by title, genre, author
export function filterAndDisplayBooks(
    books,
    filters,
    page,
    BOOKS_PER_PAGE,
    authors
  ) {
    const result = [];
  
    for (const book of books) {
      let genreMatch = filters.genre === "any";
  
      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) genreMatch = true;
      }
  
      if (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }
  
    page = 1;
    const matches = result;
  
    const messageElement = document.querySelector("[data-list-message]");
    if (result.length < 1) {
      messageElement.classList.add("list__message_show");
    } else {
      messageElement.classList.remove("list__message_show");
    }
  
    document.querySelector("[data-list-items]").innerHTML = "";
    const newItems = document.createDocumentFragment();
  
    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
      const element = document.createElement("button");
      element.classList = "preview";
      element.setAttribute("data-preview", id);
  
      element.innerHTML = `
          <img class="preview__image" src="${image}" />
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
          </div>
        `;
  
      newItems.appendChild(element);
    }
  
    document.querySelector("[data-list-items]").appendChild(newItems);
    document.querySelector("[data-list-button]").disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;
  
    document.querySelector("[data-list-button]").innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
      `;
  
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  
    return { matches, page };
  }
  
  export const updateSearchDisplay = function (
    books,
    authors,
    page,
    BOOKS_PER_PAGE
  ) {
    document
      .querySelector("[data-search-form]")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
  
        const result = filterAndDisplayBooks(
          books,
          filters,
          page,
          BOOKS_PER_PAGE,
          authors
        );
  
        return result;
      });
  };