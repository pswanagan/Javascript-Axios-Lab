import { clear, appendCarousel, createCarouselItem } from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");

// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_56PT4MgCCGxyAkIhFcDHYFnM5I7puQvsLtmqB5BezueATfTBNCohtKxC2E7G4Xjv";
// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Log when a request starts
    console.log(`Request started at: ${new Date().toISOString()}`);

    // Add a custom property to track the start time
    config.metadata = { startTime: new Date() };
    return config;
  },
  function (error) {
    // Do something with request error

    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Measure and log the time taken for the request
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(
      `Response received at: ${endTime.toISOString()} (Duration: ${duration} ms)`,
    );

    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  },
);
/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {
  try {
    // Replace with the actual API URL
    const apiUrl = `https://api.thecatapi.com/v1/breeds?api_key=${API_KEY}`;

    // Fetching the list of breeds from the cat API
    const response = await axios.get(apiUrl, {
      onDownloadProgress: updateProgress,
    });

    const breeds = response.data;

    const breedSelect = document.getElementById("breedSelect");
    // Creating and appending options for each breed
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id; // Set the value to the breed's id
      option.textContent = breed.name; // Set the display text to the breed's name
      breedSelect.appendChild(option);
    });

    breedSelect.addEventListener("change", handleBreedSelection);

    // Trigger handleBreedSelection to load the initial carousel
    // This will work if there's a default selected option in breedSelect
    if (breedSelect.value) {
      handleBreedSelection({ target: breedSelect });
    }
  } catch (error) {
    console.error("Failed to load breeds:", error);
  }
}

// Execute the function immediately
initialLoad();
/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

async function handleBreedSelection(event) {
  const breedId = event.target.value;
  const breedName = event.target.options[event.target.selectedIndex].text;
  const apiUrl = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=10&hasBreed=1&api_key=${API_KEY}`;

  try {
    const response = await axios.get(apiUrl, {
      onDownloadProgress: updateProgress,
    });
    const breedImages = response.data;

    // Clearing existing carousel items
    clear();

    breedImages.forEach((image) => {
      // Create new carousel item

      const carouselElement = createCarouselItem(
        image.url,
        `Image of ${breedName}`,
        image.id,
      );
      appendCarousel(carouselElement);
    }); // Update infoDump with breed information
    const infoDump = document.getElementById("infoDump");
    infoDump.innerHTML = ""; // Clear existing content

    if (breedImages.length > 0 && breedImages[0].breeds.length > 0) {
      const breed = breedImages[0].breeds[0];
      const infoContent = document.createElement("div");

      // Add the breed's name, description, and other details you want to display
      infoContent.innerHTML = `
        <h3>${breed.name}</h3>
        <p>${breed.description}</p>
        <p>Temperament: ${breed.temperament}</p>
        <p>Life Span: ${breed.life_span} years</p>
        <p>Weight: ${breed.weight.metric} kg</p>
        <p>Origin: ${breed.origin}</p>
      `;

      infoDump.appendChild(infoContent);
    } else {
      infoDump.innerHTML = "<p>Breed information not available.</p>";
    }
  } catch (error) {
    console.error("Error fetching breed information:", error);
  }
}
// Attach the event listener to breedSelect
document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = "0%";
  } else {
    console.error("Progress bar element not found");
  }
  // Set the body cursor to progress
  document.body.style.cursor = "progress";
  // Attach the event listener to breedSelect
  const breedSelect = document.getElementById("breedSelect");
  if (breedSelect) {
    breedSelect.addEventListener("change", handleBreedSelection);
  } else {
    console.error("breedSelect element not found");
  }
});
/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
function updateProgress(event) {
  // Log the ProgressEvent object
  console.log(event);

  // Calculate the percentage of completion
  const percentCompleted = Math.round((event.loaded * 100) / event.total);

  // Update the progress bar width
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${percentCompleted}%`;
}
/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
