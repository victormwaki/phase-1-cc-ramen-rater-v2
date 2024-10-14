// Handle the display of ramen details when an image is clicked
const handleClick = (ramen) => {
  // Get the elements for displaying ramen details
  const detailImage = document.querySelector('#ramen-detail img'); // Selects the image element in the ramen details section
  const detailName = document.querySelector('#ramen-detail h2'); // Selects the name element in the ramen details section
  const detailRestaurant = document.querySelector('#ramen-detail h3'); // Selects the restaurant element in the ramen details section
  const ratingDisplay = document.querySelector('#rating-display'); // Selects the rating display element
  const commentDisplay = document.querySelector('#comment-display'); // Selects the comment display element

  // Update the details section with the clicked ramen's data
  detailImage.src = ramen.image; // Updates the image source with the clicked ramen's image
  detailName.textContent = ramen.name; // Updates the name field with the clicked ramen's name
  detailRestaurant.textContent = ramen.restaurant; // Updates the restaurant field with the clicked ramen's restaurant
  ratingDisplay.textContent = ramen.rating; // Updates the rating display with the clicked ramen's rating
  commentDisplay.textContent = ramen.comment; // Updates the comment display with the clicked ramen's comment

  // Save the current ramen to global state (used for edit/delete operations)
  currentRamen = ramen; // Assigns the clicked ramen object to `currentRamen` so it can be edited or deleted
};

// Add a listener for form submissions to add new ramen
const addSubmitListener = () => {
  // Select the new ramen form from the HTML
  const form = document.querySelector('#new-ramen'); // Selects the form that allows users to add a new ramen

  // Add an event listener that runs when the form is submitted
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page

    // Create a new ramen object from the form data
    const newRamen = {
      name: event.target['name'].value, // Gets the value from the name input field
      restaurant: event.target['restaurant'].value, // Gets the value from the restaurant input field
      image: event.target['image'].value, // Gets the value from the image URL input field
      rating: event.target['rating'].value, // Gets the value from the rating input field
      comment: event.target['comment'].value, // Gets the value from the comment input field
    };

    // Send a POST request to the server to add the new ramen
    fetch('http://localhost:3000/ramens', {
      method: 'POST', // Use the POST method to send data to the server
      headers: {
        'Content-Type': 'application/json', // Tell the server the data being sent is in JSON format
      },
      body: JSON.stringify(newRamen), // Convert the new ramen object to JSON and send it to the server
    })
      .then((res) => res.json()) // Convert the server's response to JSON
      .then((ramen) => {
        displayRamenOnPage(ramen); // Display the new ramen in the menu
        form.reset(); // Clear the form fields after submission
      });
  });
};

// Fetch and display all ramen options from the server
const displayRamens = () => {
  fetch('http://localhost:3000/ramens') // Fetch data from the /ramens endpoint on the server
    .then((res) => res.json()) // Convert the response to JSON format
    .then((ramenData) => {
      // Iterate over the array of ramen objects and display each one
      ramenData.forEach((ramen) => displayRamenOnPage(ramen)); // Call the helper function to display each ramen
      if (ramenData.length > 0) {
        handleClick(ramenData[0]); // Display the details of the first ramen by default
      }
    });
};

// Helper function to display a single ramen image in the ramen menu
const displayRamenOnPage = (ramen) => {
  const ramenMenu = document.querySelector('#ramen-menu'); // Selects the ramen menu element

  // Create a new image element for each ramen
  const img = document.createElement('img'); // Creates a new <img> element
  img.src = ramen.image; // Sets the image's source URL to the ramen's image
  img.alt = ramen.name; // Sets the alt text of the image to the ramen's name

  // Add an event listener to the image that displays ramen details when clicked
  img.addEventListener('click', () => handleClick(ramen)); // When the image is clicked, it calls `handleClick` to show ramen details

  // Append the new image to the ramen menu
  ramenMenu.appendChild(img); // Adds the image to the ramen menu on the page
};

// Add a listener for the edit form to update ramen's rating and comment
const addEditFormListener = () => {
  const editForm = document.querySelector('#edit-ramen'); // Select the edit form for updating ramen details

  // Add an event listener to the edit form's submission
  editForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from reloading the page when submitted

    const newRating = document.querySelector('#edit-rating').value; // Get the new rating value from the input field
    const newComment = document.querySelector('#edit-comment').value; // Get the new comment value from the textarea

    // Update the displayed ramen details
    document.querySelector('#rating-display').textContent = newRating; // Update the displayed rating with the new value
    document.querySelector('#comment-display').textContent = newComment; // Update the displayed comment with the new value

    // Send a PATCH request to update the ramen on the server
    fetch(`http://localhost:3000/ramens/${currentRamen.id}`, {
      method: 'PATCH', // Use the PATCH method to partially update the ramen data
      headers: {
        'Content-Type': 'application/json', // Indicate that the body contains JSON data
      },
      body: JSON.stringify({
        rating: newRating, // Update the ramen's rating
        comment: newComment, // Update the ramen's comment
      }),
    })
      .then((res) => res.json()) // Convert the response to JSON format
      .then((updatedRamen) => {
        // Update the currentRamen object with the newly updated data
        currentRamen.rating = updatedRamen.rating; // Update the currentRamen rating
        currentRamen.comment = updatedRamen.comment; // Update the currentRamen comment
      });
  });
};

// Add a listener for the delete button to remove the ramen
const addDeleteListener = () => {
  const deleteButton = document.querySelector('#delete-ramen'); // Select the delete button

  // Add an event listener to the delete button
  deleteButton.addEventListener('click', () => {
    // Send a DELETE request to remove the ramen from the server
    fetch(`http://localhost:3000/ramens/${currentRamen.id}`, {
      method: 'DELETE', // Use the DELETE method to remove the ramen from the server
    }).then(() => {
      // Remove the ramen from the menu
      document.querySelectorAll('#ramen-menu img').forEach((img) => {
        if (img.src === currentRamen.image) {
          img.remove(); // Remove the ramen's image from the menu
        }
      });

      // Clear the ramen details section
      document.querySelector('.detail-image').src = './assets/image-placeholder.jpg'; // Reset the image to the placeholder
      document.querySelector('.name').textContent = 'Insert Name Here'; // Reset the name field
      document.querySelector('.restaurant').textContent = 'Insert Restaurant Here'; // Reset the restaurant field
      document.querySelector('#rating-display').textContent = 'Insert rating here'; // Reset the rating display
      document.querySelector('#comment-display').textContent = 'Insert comment here'; // Reset the comment display
    });
  });
};

// The main function initializes the application
const main = () => {
  displayRamens(); // Fetch and display all ramen options from the server
  addSubmitListener(); // Add event listener for the new ramen form
  addEditFormListener(); // Add event listener for the edit form
  addDeleteListener(); // Add event listener for the delete button
};

// Global variable to store the currently displayed ramen (used for editing and deleting)
let currentRamen;

// Call the main function to start the app when the page loads
main();
