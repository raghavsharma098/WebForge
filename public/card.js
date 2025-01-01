function generateCards(data) {
    const cardContainer = document.getElementById("member-tiles");
  
    // Clear the card container before adding new ones (if needed)
    cardContainer.innerHTML = "";
  
    // Loop through the user data and create cards
    data.forEach(user => {
      const card = document.createElement("div");
      card.classList.add("card-client");
  
      // Create the card content with dynamic user data
      card.innerHTML = `
        <div class="user-picture">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
          </svg>
        </div>
        <p class="name-client">${user.name} 
          <span>${user.title || "No Title"}</span>
        </p>
        <div class="social-media">
          <div class="flex justify-between items-center px-8 relative">
            ${user.linkedin ? `<a href="${user.linkedin}" target="_blank"><span class="tooltip-social">LinkedIn</span></a>` : ""}
            ${user.github ? `<a href="${user.github}" target="_blank"><span class="tooltip-social">GitHub</span></a>` : ""}
          </div>
        </div>
        <button>View more</button>
      `;
  
      // Append the card to the container
      cardContainer.appendChild(card);
    });
  }
  