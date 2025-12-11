const navOptions = document.querySelectorAll("nav ul li a");
const main = document.querySelector("main");
let currentPage = "main";
let allItems = [];

async function loadSearch() {
  try {
    const response = await fetch(
      "https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items"
    );
    const data = await response.json();
    allItems = data;

    data.sort((a, b) => a.name.localeCompare(b.name));
    renderItems(data);

    const searchInput = document.querySelector("input[type=search]");
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredItems = allItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
      renderItems(filteredItems);
    });

    const dropdownButton = document.querySelector(".add-items-button");
    const addItems = document.querySelector(".add-items");
    dropdownButton.addEventListener("click", () => {
      const style = window.getComputedStyle(addItems).display;
      const dropDownIcon = document.querySelector(".dropdown-icon");
      if (style === "none") {
        addItems.style.display = "flex";
        dropDownIcon.style.transform = "rotate(90deg)";
      } else {
        addItems.style.display = "none";
        dropDownIcon.style.transform = "rotate(0deg)";
      }
    });

    const addItemToDatabase = document.querySelector("#add-item");
    const itemName = document.querySelector("#item-name");
    const itemPrice = document.querySelector("#item-price");
    addItemToDatabase.addEventListener("click", async (e) => {
      e.preventDefault();

      const nameValue = itemName.value.trim();
      const priceValue = itemPrice.value.trim();

      if (!nameValue) {
        alert("Please enter an item name.");
        itemName.focus();
        return;
      }

      if (!priceValue || isNaN(priceValue) || Number(priceValue) <= 0) {
        alert("Please enter a valid item price.");
        itemPrice.focus();
        return;
      }

      data.sort((a, b) => a.id - b.id);
      const lastID = Number(data[data.length - 1].id);
      await fetch(
        "https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: String(lastID + 1),
            name: itemName.value
              .trim()
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            price: Number(itemPrice.value).toFixed(2),
            num_in_cart: 0,
            favorite: false,
            checked: false,
          }),
        }
      );
      loadPage(currentPage);
    });
  } catch (error) {
    console.error("Failed to fetch items:", error);
  }
}

async function loadFavorites() {
  try {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    const response = await fetch(
      "https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items"
    );
    const data = await response.json();

    data.sort((a, b) => a.name.localeCompare(b.name));
    const favorites = data.filter((item) => item.favorite);

    favorites.map((item) => {
      tbody.innerHTML += `<tr><td>${item.name}</td><td>$${item.price}</td><td><div class="add-to-cart-container"><input type="number" min="1" value="1" aria-label="Quantity of ${item.name} to add to cart"></input><button class="add-to-cart-button" data-id="${item.id}" aria-label="Add ${item.name} to cart"></button></div></td><td><input id="favorite-${item.id}" class ="favorite" type="checkbox" data-id="${item.id}" aria-label="Remove ${item.name} from favorites" checked><label for="favorite-${item.id}" class="heart-label"></label></td></tr>`;
    });

    updateCart();
    updateFavorites();
  } catch (error) {
    console.error("Failed to fetch items:", error);
  }
}

async function loadMain() {
  try {
    const tbody = document.querySelector("tbody");
    const mainContent = document.querySelector(".main-content");
    tbody.innerHTML = "";
    const response = await fetch(
      "https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items"
    );
    const data = await response.json();

    data.sort((a, b) => a.name.localeCompare(b.name));
    const itemsInCart = data.filter((item) => item.num_in_cart > 0);

    itemsInCart.map((item) => {
      tbody.innerHTML += `<tr><td><input id="favorite-${
        item.id
      }" class ="favorite" type="checkbox" data-id="${item.id}" ${
        item.favorite ? "checked" : ""
      } aria-label="Mark ${item.name} as favorite"><label for="favorite-${
        item.id
      }" class="heart-label"></label></td><td>${item.name}</td><td>${
        item.num_in_cart
      }</td><td>$${(item.price * item.num_in_cart).toFixed(
        2
      )}</td><td><input id="check-off-${
        item.id
      }" class = "check-off" type="checkbox" data-id="${item.id}" ${
        item.checked ? "checked" : ""
      } aria-label="Mark ${item.name} as checked"><label for="check-off-${
        item.id
      }" class="check-label"></label></td><td><button class="delete-button" data-id="${
        item.id
      }" aria-label="Remove ${item.name} from cart"></button></td></tr>`;
    });

    const totalCost = itemsInCart.reduce(
      (acc, item) => acc + item.price * item.num_in_cart,
      0
    );

    mainContent.innerHTML += `<div class="total-cost"><img src="../img/cart-total.svg" alt="Total Cost">Total Cost: $${totalCost.toFixed(
      2
    )}</div>`;

    updateFavorites();
    updateDelete(currentPage);

    const checkboxes = document.querySelectorAll(".check-off");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", async () => {
        const id = checkbox.dataset.id;
        await fetch(
          `https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              checked: checkbox.checked,
            }),
          }
        );
      });
    });
  } catch (error) {
    console.error("Failed to fetch items:", error);
  }
}

async function updateFavorites() {
  const favoriteButtons = document.querySelectorAll(".favorite");
  favoriteButtons.forEach((checkbox) => {
    checkbox.addEventListener("change", async () => {
      const id = checkbox.dataset.id;
      await fetch(
        `https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            favorite: checkbox.checked,
          }),
        }
      );
      if (currentPage === "favorites") {
        loadPage(currentPage);
      }
    });
  });
}

async function updateDelete(page) {
  const removeButtons = document.querySelectorAll(".delete-button");
  removeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      if (page === "search") {
        await fetch(
          `https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items/${id}`,
          {
            method: "DELETE",
          }
        );
      }
      if (page === "main") {
        await fetch(
          `https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              num_in_cart: 0,
            }),
          }
        );
      }
      loadPage(currentPage);
    });
  });
}

async function updateCart() {
  const addButtons = document.querySelectorAll(".add-to-cart-button");
  addButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const td = button.parentElement;
      const input = td.querySelector("input[type=number]");
      const quantity = Number(input.value);
      await fetch(
        `https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            num_in_cart: quantity,
          }),
        }
      );
    });
  });
}

function renderItems(items) {
  const searchResults = document.querySelector(".results");
  const noResults = document.querySelector(".no-results");
  searchResults.innerHTML = "";

  if (items.length === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "grocery-item";
    div.innerHTML = `<div class="item-info">${item.name} <br /> $${
      item.price
    }</div><div class="item-configure"><button class="delete-button" data-id="${
      item.id
    }" aria-label="Remove ${
      item.name
    } from grocery database"></button><input id="favorite-${
      item.id
    }" class ="favorite" type="checkbox" data-id="${item.id}" ${
      item.favorite ? "checked" : ""
    } aria-label="Favorite ${item.name}"><label for="favorite-${
      item.id
    }" class="heart-label"></label><input type="number" min="1" value="1" aria-label="Quantity of ${
      item.name
    } to add to cart"></input><button class="add-to-cart-button"data-id="${
      item.id
    }" aria-label="Add ${item.name} to cart"></button></div></div>`;
    searchResults.appendChild(div);
  });

  updateFavorites();
  updateDelete(currentPage);
  updateCart();
}

async function loadPage(page) {
  currentPage = page;

  await fetch(`html/${page}.html`)
    .then((response) => response.text())
    .then((html) => {
      main.innerHTML = html;

      if (page === "main") {
        loadMain();
      }

      if (page === "search") {
        loadSearch();
      }

      if (page === "favorites") {
        loadFavorites();
      }
    });
}

navOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    e.preventDefault();
    const page = option.dataset.page;
    loadPage(page);
  });
});

loadPage("main");
