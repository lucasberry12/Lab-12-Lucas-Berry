const navOptions = document.querySelectorAll("nav ul li a");
const main = document.querySelector("main");

async function loadSearch() {
  try {
    const searchResults = document.querySelector(".results");
    searchResults.innerHTML = "";
    const response = await fetch(
      "https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items"
    );
    const data = await response.json();

    data.map((item) => {
      const div = document.createElement("div");
      div.innerHTML = `${item.name} <br /> ${item.price}`;
      searchResults.appendChild(div);
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
      tbody.innerHTML += `<tr><td>${item.name}</td><td>${item.price}</td><td><input type="number" min="1" value="1"></input><button data-id="${item.id}">Add to Cart</button></td><td><input type="checkbox" data-id="${item.id}" checked></td></tr>`;
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

    const checkboxes = document.querySelectorAll("input[type=checkbox]");
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
              favorite: checkbox.checked,
            }),
          }
        );
      });
    });
  } catch (error) {
    console.error("Failed to fetch items:", error);
  }
}

async function loadMain() {
  try {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    const response = await fetch(
      "https://plx7aejwka.execute-api.us-east-2.amazonaws.com/items"
    );
    const data = await response.json();

    data.sort((a, b) => a.name.localeCompare(b.name));
    const itemsInCart = data.filter((item) => item.num_in_cart > 0);

    itemsInCart.map((item) => {
      tbody.innerHTML += `<tr><td>${item.name}</td><td>${
        item.num_in_cart
      }</td><td>${
        item.price * item.num_in_cart
      }</td><td><input type="checkbox" data-id="${item.id}" ${
        item.checked ? "checked" : ""
      }></td><td><button data-id="${item.id}">Remove</button></td></tr>`;
    });

    const checkboxes = document.querySelectorAll("input[type=checkbox]");
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

    const removeButtons = document.querySelectorAll("button");
    removeButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
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
      });
    });
  } catch (error) {
    console.error("Failed to fetch items:", error);
  }
}

async function loadPage(page) {
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
