/* add your code here */
document.addEventListener("DOMContentLoaded", () => {
    // Parse the JSON data from users.js and stocks-complete.js
    const users = JSON.parse(userContent);
    const stocks = JSON.parse(stockContent);
  
    // Get DOM elements
    const userList = document.querySelector(".user-list");
    const userForm = document.querySelector(".userEntry");
    const stockList = document.querySelector(".portfolio-list");
    const stockDetails = {
      logo: document.getElementById("logo"),
      name: document.getElementById("stockName"),
      sector: document.getElementById("stockSector"),
      industry: document.getElementById("stockIndustry"),
      address: document.getElementById("stockAddress"),
    };
  
    let selectedUserId = null;
  
    // Function to populate the user list
    function generateUserList(users) {
      userList.innerHTML = ""; // Clear existing list
      users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${user.user.lastname}, ${user.user.firstname}`;
        listItem.dataset.userId = user.id;
        listItem.addEventListener("click", () => {
          selectUser(user.id); // Trigger selectUser function on click
        });
        userList.appendChild(listItem);
      });
    }
  
    // Function to populate the form with user data
    function populateForm(user) {
      userForm.querySelector("#userID").value = user.id;
      userForm.querySelector("#firstname").value = user.user.firstname;
      userForm.querySelector("#lastname").value = user.user.lastname;
      userForm.querySelector("#address").value = user.user.address;
      userForm.querySelector("#city").value = user.user.city;
      userForm.querySelector("#email").value = user.user.email;
    }
  
    // Function to select a user and display their portfolio
    function selectUser(userId) {
      selectedUserId = userId;
      const user = users.find((user) => user.id === userId);
      if (user) {
        populateForm(user); // Populate the form with user data
        populatePortfolio(user.portfolio); // Populate the portfolio with user’s stocks
        clearStockDetails(); // Clear stock details when a new user is selected
      }
    }
  
    // Function to populate the portfolio list without table borders
    function populatePortfolio(portfolio) {
      stockList.innerHTML = ""; // Clear existing stock list
      portfolio.forEach((stock) => {
        const stockData = stocks.find((s) => s.symbol === stock.symbol);
        if (stockData) {
          const symbolElement = document.createElement("div");
          symbolElement.textContent = stock.symbol;
          symbolElement.style.padding = "0.25em 0";
          symbolElement.style.lineHeight = "2em"; // Increase line height
  
          const ownedElement = document.createElement("div");
          ownedElement.textContent = stock.owned;
          ownedElement.style.padding = "0.25em 0";
          ownedElement.style.lineHeight = "2em"; // Increase line height
  
          const buttonElement = document.createElement("button");
          buttonElement.textContent = "View"; // Change button text to "View"
          buttonElement.classList.add("view-details");
          buttonElement.dataset.symbol = stock.symbol;
          buttonElement.style.padding = "0.25em 0";
          buttonElement.style.lineHeight = "2em"; // Increase line height
          buttonElement.addEventListener("click", () => {
            showStockDetails(stock.symbol); // Show stock details on click
          });
  
          stockList.appendChild(symbolElement);
          stockList.appendChild(ownedElement);
          stockList.appendChild(buttonElement);
        }
      });
    }
  
    // Function to clear stock details
    function clearStockDetails() {
      stockDetails.logo.src = ""; // Clear logo
      stockDetails.name.textContent = ""; // Clear name
      stockDetails.sector.textContent = ""; // Clear sector
      stockDetails.industry.textContent = ""; // Clear industry
      stockDetails.address.textContent = ""; // Clear address
    }
  
    // Function to show stock details
    function showStockDetails(symbol) {
      const stock = stocks.find((s) => s.symbol === symbol);
      if (stock) {
        const logoSrc = `logos/${stock.symbol}.svg`;
  
        // Check if the logo exists
        fetch(logoSrc, { method: "HEAD" })
          .then((response) => {
            if (response.ok) {
              stockDetails.logo.src = logoSrc;
            } else {
              stockDetails.logo.src = ""; // Clear the logo src if not found
            }
          })
          .catch(() => {
            stockDetails.logo.src = ""; // Clear the logo src in case of error
          });
  
        stockDetails.name.textContent = stock.name;
        stockDetails.sector.textContent = stock.sector;
        stockDetails.industry.textContent = stock.subIndustry;
        stockDetails.address.textContent = stock.address;
      }
    }
  
    // Register the event listener on the delete button
    const deleteButton = document.getElementById("btnDelete");
  
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission
  
      const userId = document.querySelector("#userID").value;
      const userIndex = users.findIndex((user) => user.id == userId);
  
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        generateUserList(users); // Update the user list
        selectedUserId = null; // Reset selected user
        userForm.reset(); // Clear the form
        stockList.innerHTML = ""; // Clear the portfolio list
        clearStockDetails(); // Clear stock details
      }
    });
  
    // Register the event listener on the save button
    const saveButton = document.getElementById("btnSave");
  
    saveButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission
  
      const userId = document.querySelector("#userID").value;
      const userIndex = users.findIndex((user) => user.id == userId);
  
      if (userIndex !== -1) {
        const updatedUser = { ...users[userIndex] }; // Create a copy of the user object
        updatedUser.user.firstname = document.querySelector("#firstname").value;
        updatedUser.user.lastname = document.querySelector("#lastname").value;
        updatedUser.user.address = document.querySelector("#address").value;
        updatedUser.user.city = document.querySelector("#city").value;
        updatedUser.user.email = document.querySelector("#email").value;
  
        users[userIndex] = updatedUser; // Replace the old user with the updated user
        generateUserList(users); // Update the user list
      }
    });
  
    // Initialize the user list on page load
    generateUserList(users);
  });
  
