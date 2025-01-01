// Menu Toggle for Mobile Navbar
const menuToggle = document.getElementById("menu-toggle");
const mobileNavbar = document.getElementById("mobile-navbar");

if (menuToggle && mobileNavbar) {
  menuToggle.addEventListener("click", () => {
    mobileNavbar.classList.toggle("hidden");

    const rect = menuToggle.getBoundingClientRect();

    if (!mobileNavbar.classList.contains("hidden")) {
      const screenWidth = window.innerWidth;
      const leftPosition = rect.left;
      const maxLeft = screenWidth - mobileNavbar.offsetWidth;

      mobileNavbar.style.top = `${rect.bottom + window.scrollY}px`;
      mobileNavbar.style.left = `${Math.min(leftPosition, maxLeft)}px`;
    }
  });
}

// Cursor Spark Effect
const sparkContainer = document.getElementById("spark-container");
const sparkPool = [];
const density = 150;

function initSparkPool() {
  for (let i = 0; i < density; i++) {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    spark.style.opacity = 0;
    spark.style.position = "absolute";
    sparkContainer.appendChild(spark);
    sparkPool.push({ element: spark, active: false });
  }
}

function spawnSpark(x, y) {
  const spark = sparkPool.find((s) => !s.active);
  if (!spark) return;

  const { element } = spark;
  spark.active = true;

  const size = Math.random() * 5 + 2;
  const angle = Math.random() * 360;
  const distance = Math.random() * 100 + 50;
  const duration = Math.random() * 1 + 0.5;

  const offsetX = Math.cos((angle * Math.PI) / 180) * distance;
  const offsetY = Math.sin((angle * Math.PI) / 180) * distance;

  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.opacity = 1;
  element.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
  element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.5)`;

  setTimeout(() => {
    element.style.opacity = 0;
    spark.active = false;
  }, duration * 1000);
}

function handleMouseMove(event) {
  const { clientX: x, clientY: y } = event;
  for (let i = 0; i < 3; i++) {
    const jitterX = Math.random() * 5 - 2.5;
    const jitterY = Math.random() * 5 - 2.5;
    spawnSpark(x + jitterX, y + jitterY);
  }
}

// Logo Spark Effect
const logoSparkContainer = document.getElementById("logo-spark-container");
const logoSparkPool = [];
const logoDensity = 50;

function initLogoSparkPool() {
  for (let i = 0; i < logoDensity; i++) {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    spark.style.opacity = 0;
    logoSparkContainer.appendChild(spark);
    logoSparkPool.push({ element: spark, active: false });
  }
}

function animateLogoSparks() {
  setInterval(() => {
    const spark = logoSparkPool.find((s) => !s.active);
    if (!spark) return;

    const { element } = spark;
    spark.active = true;

    const size = Math.random() * 5 + 2;
    const angle = Math.random() * 360;
    const distance = Math.random() * 50 + 10;
    const duration = Math.random() * 2 + 1;

    const offsetX = Math.cos((angle * Math.PI) / 180) * distance;
    const offsetY = Math.sin((angle * Math.PI) / 180) * distance;

    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.left = "50%";
    element.style.top = "50%";
    element.style.opacity = 1;
    element.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.5)`;

    setTimeout(() => {
      element.style.opacity = 0;
      spark.active = false;
    }, duration * 1000);
  }, 100);
}

// Custom Cursor
const customCursor = document.getElementById("custom-cursor");
if (customCursor) {
  document.addEventListener("mousemove", (event) => {
    const { clientX: x, clientY: y } = event;
    customCursor.style.left = `${x}px`;
    customCursor.style.top = `${y}px`;
  });
}

// Initialize Animations
window.onload = () => {
  initSparkPool();
  document.addEventListener("mousemove", handleMouseMove);

  if (logoSparkContainer) {
    initLogoSparkPool();
    animateLogoSparks();
  }
};

// Fetch Data from Backend
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.error("Error fetching data:", err));

// Submit Data to Backend
const submitButton = document.getElementById("submit-button");
if (submitButton) {
  submitButton.addEventListener("click", () => {
    const name = document.getElementById("name-input").value;
    const email = document.getElementById("email-input").value;

    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Submission successful:", data))
      .catch((err) => console.error("Error submitting data:", err));
  });
}
  