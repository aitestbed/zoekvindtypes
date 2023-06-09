const api_url_base = "https://cors-anywhere.herokuapp.com/https://zoeken.oba.nl/api/v1/search/?q=";
const api_key = "&authorization=76f45dfa187d66be5fd6af05573eab04";
const api_output = "&output=json";

async function getResults(searchTerm, facet = "") {
  const api_url = api_url_base + searchTerm + facet + api_key + api_output;

  try {
    const response = await fetch(api_url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.results;
    } else {
      console.error("Error fetching data:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function showResults(category, results) {
  const resultsContainer = document.getElementById(category + "Results");
  resultsContainer.innerHTML = "";

  results.forEach((result) => {
    const img = document.createElement("img");
    img.src = result.coverimages[1] || "fallback.JPG";
    img.alt = result.titles[0];
    img.onerror = function () {
      this.onerror = null;
      this.src = "fallback.JPG";
    };

    let detailLink = result.detailLink;
    if (!detailLink) {
      detailLink = result.detaillink;
    }

    const link = document.createElement("a");
    link.href = detailLink.replace("http:", "https:");
    link.target = "_blank";
    link.appendChild(img);

    const item = document.createElement("div");
    item.className = "result-item";
    item.appendChild(link);

    resultsContainer.appendChild(item);
  });
}

async function search() {
  const searchTerm = document.getElementById("searchTerm").value.trim();

  if (searchTerm.length === 0) {
    return;
  }

  categoryContainers.forEach((container) => {
    container.style.display = "none";
  });

 const categories = [
    { name: "boeken", facet: "&facet=type(book)&refine=true" },
    { name: "dvds", facet: "&facet=type(movie)&refine=true" },
    { name: "activiteiten", facet: "%20table:Activiteiten&refine=true" },
    { name: "cursussen", facet: "%20table:jsonsrc&refine=true" },
];
  for (const category of categories) {
    const results = await getResults(searchTerm, category.facet);
    if (results.length > 0) {
      showResults(category.name, results);
      document.getElementById(category.name + "Container").style.display = "block";
    } else {
      document.getElementById(category.name + "Container").style.display = "none";
    }
  }
}


document.getElementById("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  search();
});

const categoryContainers = document.querySelectorAll(".category-container");
categoryContainers.forEach((container) => {
  container.style.display = "none";
});
