// Seleceted Elements
const categoryButtonContainer = document.getElementById(
  "category-botton-container"
);
const videosContainer = document.getElementById("videos-container");
const errorEl = document.getElementById("error");
const loadingSpinner = document.getElementById("loading-spinner");
const sortedEl = document.getElementById("sorted-btn");

// Initialize Value
let selectedCategory = 1000;
let sorted = true;

// Sort Add Event Listener
sortedEl.addEventListener("click", () => {
  sorted = true;
  fetchDataByCategories(selectedCategory, sorted);
});

// Button Fetch
const categoriesButtonFetch = async () => {
  loadingSpinnerFun(true);
  const url = "https://openapi.programming-hero.com/api/videos/categories";
  const res = await fetch(url);
  const data = await res.json();
  const categories = data.data;
  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.className = "category-btn btn px-8 ml-4";
    categoryButton.innerText = category.category;
    const cetegoryID = category.category_id;
    categoryButton.addEventListener("click", () => {
      fetchDataByCategories(cetegoryID);

      // Button Color Change
      const allButton = document.querySelectorAll(".category-btn");
      for (const btn of allButton) {
        btn.classList.remove("text-white", "bg-red-600", "hover:bg-red-500");
      }
      // allButton.forEach((btn) => {
      //   btn.classList.remove("text-white", "bg-red-600", "hover:bg-red-500");
      // });
      categoryButton.classList.add(
        "text-white",
        "bg-red-600",
        "hover:bg-red-500"
      );
    });
    categoryButtonContainer.appendChild(categoryButton);
  });
};

// Categories Fatch
const fetchDataByCategories = async (cetegoryID, sorted) => {
  selectedCategory = cetegoryID;
  const url = `https://openapi.programming-hero.com/api/videos/category/${cetegoryID}`;
  const res = await fetch(url);
  const data = await res.json();
  const videos = data.data;
  if (sorted) {
    videos.sort((a, b) => {
      // console.log(a.others?.views, b.others?.views)

      // First;
      const totalViewStringFirst = a.others?.views;
      // const totalViewNumberFirst = parseFloat(totalViewStringFirst);
      const totalViewNumberFirst =
        parseFloat(totalViewStringFirst.replace("K", "")) || 0;

      // second
      const totalViewStringSecond = b.others?.views;
      const totalViewNumberSecond =
        parseFloat(totalViewStringSecond.replace("K", "")) || 0;

      // total
      const total = totalViewNumberSecond - totalViewNumberFirst;
      return total;
    });
  }
  if (videos.length === 0) {
    errorEl.classList.remove("hidden");
  } else {
    errorEl.classList.add("hidden");
  }

  videosContainer.innerHTML = "";

  videos.forEach((video) => {
    const { thumbnail, title, authors, others } = video;
    const { profile_name, profile_picture, verified } = authors[0];
    const { views, posted_date } = others;

    let verifiedBadge = "";
    if (verified) {
      verifiedBadge = `<p>Verify</p>`;
    }
    const videoCard = document.createElement("div");
    videoCard.innerHTML = `
    <img
    class="rounded-lg h-36 w-full"
    src=${thumbnail}
    alt=""
  />
  <div class="authorImage-title flex gap-2 pt-4">
    <img
      class="w-8 h-8 rounded-full"
      src=${profile_picture}
      alt=""
    />
    <div class="">
      <h3 class="text-base font-bold">
        ${title}
      </h3>
      <div class="author-view text-sm mt-1">
        <p class="flex">${profile_name}  </p>
        <strong class="text-green-600">${verifiedBadge}</strong>
        
        <p>${views}</p>
      </div>
    </div>
  </div>
    `;
    videosContainer.appendChild(videoCard);
  });
  loadingSpinnerFun(false);
};

// Loading Spinner
const loadingSpinnerFun = (isLoadingSpinner) => {
  if (isLoadingSpinner) {
    loadingSpinner.classList.remove("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
};

// Funtion Default Call
categoriesButtonFetch();
fetchDataByCategories(selectedCategory, sorted);


// const verifiedBadge = authors[0].verified
//                     ? `<img src="./assets/verified.svg" alt="Verified" />`
