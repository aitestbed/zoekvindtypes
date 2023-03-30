const api_url_base = "https://cors-anywhere.herokuapp.com/https://zoeken.oba.nl/api/v1/search/?q=";
const api_key = "authorization=76f45dfa187d66be5fd6af05573eab04";
const api_output = "&output=json";

const facets = {
  boeken: "&facet=type(book)",
  dvds: "&facet=type(movie)",
  activiteiten: "%20table:Activiteiten",
  cursussen: "%20table:jsonsrc",
};

async function getResults(searchTerm, facet = "") {
  const api_url = api_url_base + searchTerm + facet + "&" + api_key + api_output;

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


function displayResults(results, containerId) {
  const resultsContainer = document.getElementById(containerId);
  resultsContainer.innerHTML = ""; // Clear previous results

  if (results.length === 0) {
    resultsContainer.textContent = "Er zijn geen resultaten";
    return;
  }

  results.forEach((result) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";

    const plaatjeLink = document.createElement("a");
    if (result.detailLink) {
      plaatjeLink.href = result.detailLink.replace("http://", "https://");
    }

    const plaatje = document.createElement("img");
    plaatje.src = result.coverimages[0];
    plaatje.alt = result.titles[0];

    plaatjeLink.appendChild(plaatje);
    resultItem.appendChild(plaatjeLink);

    resultsContainer.appendChild(resultItem);
  });
}

async function search() {
  const searchTerm = document.getElementById("searchTerm").value.trim();

  if (searchTerm.length === 0) {
    return;
  }

  const categories = [
    { name: "boeken", facet: "&facet=type(book)" },
    { name: "dvds", facet: "&facet=type(movie)" },
    { name: "activiteiten", facet: "%20table:Activiteiten" },
    { name: "cursussen", facet: "%20table:jsonsrc" },
  ];

  for (const category of categories) {
    const results = await getResults(searchTerm, category.facet);
    if (results.length > 0) {
      showResults(category.name, results);
      document.getElementById(category.name + "Results").parentElement.style.display = "block";
    } else {
      document.getElementById(category.name + "Results").parentElement.style.display = "none";
    }
  }
}


document.addEventListener("DOMContentLoaded", () => {
  search();
});
