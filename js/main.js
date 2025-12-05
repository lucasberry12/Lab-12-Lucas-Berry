const navOptions = document.querySelectorAll("nav ul li a");
const main = document.querySelector("main");
let currentPage = "main";

async function loadSearch() {
  try {
    const searchResults = document.querySelector(".results");
    searchResults.innerHTML = "";
    const response = await fetch(
      "https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items"
    );
    const data = await response.json();

    data.sort((a, b) => a.name.localeCompare(b.name));

    data.map((item) => {
      const div = document.createElement("div");
      div.className = "grocery-item";
      div.innerHTML = `<div class="item-info">${item.name} <br /> $${
        item.price
      }</div><div class="item-configure"><button class="delete-button" data-id="${
        item.id
      }"></button><input id="favorite-${
        item.id
      }" class ="favorite" type="checkbox" data-id="${item.id}" ${
        item.favorite ? "checked" : ""
      }><label for="favorite-${
        item.id
      }" class="heart-label"></label><input type="number" min="1" value="1"></input><button class="add-to-cart-button"data-id="${
        item.id
      }"></button></div></div>`;
      searchResults.appendChild(div);
    });

    updateFavorites();
    updateDelete(currentPage);

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
        loadPage(currentPage);
      });
    });

    const addItemToDatabase = document.querySelector("#add-item");
    const itemName = document.querySelector("#item-name");
    const itemPrice = document.querySelector("#item-price");
    addItemToDatabase.addEventListener("click", async (e) => {
      e.preventDefault();
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
            price: itemPrice.value,
            num_in_cart: 0,
            favorite: false,
            checked: false,
          }),
        }
      );
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
      tbody.innerHTML += `<tr><td>${item.name}</td><td>$${item.price}</td><td><input type="number" min="1" value="1"></input><button data-id="${item.id}">Add to Cart</button></td><td><input id="favorite-${item.id}" class ="favorite" type="checkbox" data-id="${item.id}" checked><label for="favorite-${item.id}" class="heart-label"></label></td></tr>`;
    });

    const addButtons = document.querySelectorAll("button");
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
      }><label for="favorite-${item.id}" class="heart-label"></label></td><td>${
        item.name
      }</td><td>${item.num_in_cart}</td><td>$${
        item.price * item.num_in_cart
      }</td><td><input id="check-off-${
        item.id
      }" class = "check-off" type="checkbox" data-id="${item.id}" ${
        item.checked ? "checked" : ""
      }><label for="check-off-${
        item.id
      }" class="check-label"></label></td><td><button class="delete-button" data-id="${
        item.id
      }"></button></td></tr>`;
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
