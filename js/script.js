// AURELIA — interactive menu, mobile navigation and contact form
document.addEventListener("DOMContentLoaded", function () {
const menuData = {
  Starters: [
    { name: "Burrata e Pomodoro", description: "Creamy burrata, heritage tomatoes, basil oil and toasted sourdough.", price: 9.50 },
    { name: "Wild Mushroom Arancini", description: "Crisp risotto bites, parmesan cream and fresh herbs.", price: 8.00 },
    { name: "Calamari Fritti", description: "Lightly fried squid, lemon and garlic aioli.", price: 10.00 }
  ],
  Mains: [
    { name: "Tagliatelle al Ragù", description: "Fresh ribbon pasta, slow-cooked beef ragù and parmesan.", price: 18.50 },
    { name: "Lemon Butter Sea Bass", description: "Pan-seared sea bass, crushed potatoes and seasonal greens.", price: 23.00 },
    { name: "Chicken Milanese", description: "Crisp chicken, rocket, shaved parmesan and lemon.", price: 19.50 }
  ],
  Vegetarian: [
    { name: "Wild Mushroom Risotto", description: "Creamy Arborio rice, roasted mushrooms and aged parmesan.", price: 17.00 },
    { name: "Aubergine Parmigiana", description: "Baked aubergine, tomato, mozzarella and fresh basil.", price: 16.50 },
    { name: "Roasted Pumpkin Ravioli", description: "Handmade ravioli, sage butter and toasted hazelnuts.", price: 18.00 }
  ],
  Desserts: [
    { name: "Classic Tiramisu", description: "Espresso-soaked sponge, mascarpone and cocoa.", price: 8.00 },
    { name: "Vanilla Panna Cotta", description: "Silky vanilla cream with seasonal berry compote.", price: 7.50 },
    { name: "Chocolate Fondant", description: "Warm chocolate centre served with vanilla ice cream.", price: 9.00 }
  ],
  Drinks: [
    { name: "Blood Orange Spritz", description: "Blood orange, sparkling water and a fresh citrus garnish.", price: 7.50 },
    { name: "Italian Lemonade", description: "Sicilian lemon, sparkling water and fresh mint.", price: 4.50 },
    { name: "Espresso", description: "Traditional Italian coffee, freshly extracted.", price: 3.00 }
  ]
};

const menuTabs = Array.from(document.querySelectorAll(".menu-tab"));
const dishGrid = document.querySelector("#dish-grid");
const menuTitle = document.querySelector("#menu-category-title");
const menuCount = document.querySelector("#menu-count");
const menuPanel = document.querySelector("#menu-panel");

const categoryTitles = {
  Starters: "To begin",
  Mains: "The main event",
  Vegetarian: "From the garden",
  Desserts: "Something sweet",
  Drinks: "Raise a glass"
};

// Render the selected category. Text is inserted using textContent to avoid
// treating menu content as HTML.
function renderMenu(category) {
  const dishes = menuData[category];
  if (!dishes) return;

  dishGrid.replaceChildren();

  dishes.forEach((dish, index) => {
    const article = document.createElement("article");
    article.className = "dish";
    article.style.animationDelay = `${index * 60}ms`;

    const top = document.createElement("div");
    top.className = "dish-top";

    const name = document.createElement("h4");
    name.textContent = dish.name;

    const price = document.createElement("span");
    price.className = "dish-price";
    price.textContent = `£${dish.price.toFixed(2)}`;

    const description = document.createElement("p");
    description.textContent = dish.description;

    top.append(name, price);
    article.append(top, description);
    dishGrid.append(article);
  });

  menuTitle.textContent = categoryTitles[category];
  menuCount.textContent = `${String(dishes.length).padStart(2, "0")} dishes`;
  menuPanel.setAttribute("aria-labelledby", `tab-${category.toLowerCase()}`);
}

function selectCategory(category, moveFocus = false) {
  menuTabs.forEach((tab) => {
    const isSelected = tab.dataset.category === category;
    tab.classList.toggle("active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    if (isSelected && moveFocus) tab.focus();
  });
  renderMenu(category);
}

menuTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectCategory(tab.dataset.category));

  // Arrow-key navigation for the accessible tab interface.
  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % menuTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + menuTabs.length) % menuTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = menuTabs.length - 1;
    else return;

    event.preventDefault();
    selectCategory(menuTabs[nextIndex].dataset.category, true);
  });
});

// Show starters when the page first loads.
renderMenu("Starters");

// Mobile navigation toggle.
const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("open", !isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

// Contact form: validate and construct a pre-populated mailto email.
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const enquiry = String(formData.get("enquiry")).trim();
  const message = String(formData.get("message")).trim();

  if (!name || !email || !enquiry || !message) {
    formFeedback.textContent = "Please complete all required fields.";
    return;
  }

  const recipient = "hello@aurelia.example";
  const subject = encodeURIComponent(`Aurelia website enquiry: ${enquiry}`);
  const body = encodeURIComponent(
    `New enquiry from the Aurelia website\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Enquiry type: ${enquiry}\n\n` +
    `Message:\n${message}`
  );

  formFeedback.textContent = "Opening your email application. Please review your message and press Send.";
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

});