// Declaring constants for API key and base URL
const API_KEY = "8da7c8a5da504a1d8e577db5a439087e";
const url = "https://newsapi.org/v2/everything?q=";

// Event listener for loading the page, fetching news with default query "India"
window.addEventListener("load", () => fetchNews("India"));

// Function to reload the page
function reload() {
  window.location.reload();
}

// Asynchronous function to fetch news based on a query
async function fetchNews(query) {
  const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
  const data = await res.json();
  bindData(data.articles);
}

// Function to bind fetched news data to HTML
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

// Function to fill data in news card template
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Variable to keep track of the currently selected navigation item
let curSelectedNav = null;

// Function to handle click event on navigation items
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

// Event listener for search button click
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});

// Declaration of variables
var input;
var cursor;
var hiddenInput;
var content = [];
var lastContent = "",
  targetContent = "";
var inputLock = false;
var autoWriteTimer;

var isMobile, isIE;

// Function to execute on window load
window.onload = function () {
  isMobile =
    navigator &&
    navigator.platform &&
    navigator.platform.match(/^(iPad|iPod|iPhone)$/);

  isIE = navigator.appName == "Microsoft Internet Explorer";

  input = document.getElementById("input");

  hiddenInput = document.getElementById("hiddenInput");
  hiddenInput.focus();

  cursor = document.createElement("cursor");
  cursor.setAttribute("class", "blink");
  cursor.innerHTML = "|";

  if (!isMobile && !isIE) input.appendChild(cursor);

  function refresh() {
    inputLock = true;

    if (targetContent.length - lastContent.length == 0) return;

    var v = targetContent.substring(0, lastContent.length + 1);

    content = [];

    var blinkPadding = false;

    for (var i = 0; i < v.length; i++) {
      var l = v.charAt(i);

      var d = document.createElement("div");
      d.setAttribute("class", "letterContainer");

      var d2 = document.createElement("div");

      var animClass = i % 2 == 0 ? "letterAnimTop" : "letterAnimBottom";

      var letterClass = lastContent.charAt(i) == l ? "letterStatic" : animClass;

      if (letterClass != "letterStatic") blinkPadding = true;

      d2.setAttribute("class", letterClass);

      d.appendChild(d2);

      d2.innerHTML = l;
      content.push(d);
    }

    input.innerHTML = "";

    for (var i = 0; i < content.length; i++) {
      input.appendChild(content[i]);
    }

    cursor.style.paddingLeft = blinkPadding ? "22px" : "0";

    if (!isMobile && !isIE) input.appendChild(cursor);

    if (targetContent.length - lastContent.length > 1) setTimeout(refresh, 150);
    else inputLock = false;

    lastContent = v;
  }

  if (document.addEventListener) {
    document.addEventListener(
      "touchstart",
      function (e) {
        clearInterval(autoWriteTimer);
        targetContent = lastContent;
      },
      false
    );

    document.addEventListener(
      "click",
      function (e) {
        clearInterval(autoWriteTimer);
        targetContent = lastContent;
        hiddenInput.focus();
      },
      false
    );

    if (!isIE) {
      // Input event is buggy on IE, so don't bother
      // (https://msdn.microsoft.com/en-us/library/gg592978(v=vs.85).aspx#feedback)
      // We will use a timer instead (below)
      hiddenInput.addEventListener(
        "input",
        function (e) {
          e.preventDefault();
          targetContent = hiddenInput.value;
          if (!inputLock) refresh();
        },
        false
      );
    } else {
      setInterval(function () {
        targetContent = hiddenInput.value;

        if (targetContent != lastContent && !inputLock) refresh();
      }, 100);
    }
  }

  hiddenInput.value = "";

  autoWriteTimer = setTimeout(function () {
    if (lastContent != "") return;
    targetContent = "type something...";
    refresh();
  }, 2000);
};
