const categoryButtonContainer = document.getElementById(
  "category-botton-container"
);
const videosContainer = document.getElementById("videos-container");
const errorEl = document.getElementById("error");
const loadingSpinner = document.getElementById("loading-spinner");

let selectedCategory = 1000;

const categoriesButtonFetch = async () => {
  loadingSpinnerFun(true);
  const url = "https://openapi.programming-hero.com/api/videos/categories";
  const res = await fetch(url);
  const data = await res.json();
  const categories = data.data;
  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.className = "btn px-8 ml-4";
    categoryButton.innerText = category.category;
    const cetegoryID = category.category_id;
    categoryButton.addEventListener("click", () =>
      fetchDataByCategories(cetegoryID)
    );
    categoryButtonContainer.appendChild(categoryButton);
  });
};

const fetchDataByCategories = async (cetegoryID) => {
  selectedCategory = cetegoryID;
  const url = `https://openapi.programming-hero.com/api/videos/category/${cetegoryID}`;
  const res = await fetch(url);
  const data = await res.json();
  const videos = data.data;
  if (videos.length === 0) {
    // const error = document.createElement("p");
    // error.innerText = "Sorry, No Vidoe Found!";
    // videosContainer.appendChild(error);

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
        <p class="flex">${profile_name}  <strong class="text-green-600">${verifiedBadge}</strong></p>
        <p>${views}</p>
      </div>
    </div>
  </div>
    `;
    videosContainer.appendChild(videoCard);
  });
  loadingSpinnerFun(false);
};

const loadingSpinnerFun = (isLoadingSpinner) => {
  if (isLoadingSpinner) {
    loadingSpinner.classList.remove("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
};

categoriesButtonFetch();
fetchDataByCategories(selectedCategory);