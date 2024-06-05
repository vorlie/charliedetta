(document.getElementById("search-form") as HTMLFormElement).addEventListener("submit", function(event) {
    event.preventDefault(); 

    const searchQuery = (document.getElementById("search-input") as HTMLInputElement).value;
    const redirectURL = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    window.location.href = redirectURL;

    (document.getElementById("search-input") as HTMLInputElement).value = "";
});

const urlParams = new URLSearchParams(window.location.search);
const queryParam = urlParams.get('q');

if (queryParam) {
    const redirectURL = `https://www.google.com/search?q=${encodeURIComponent(queryParam)}`;
    window.location.href = redirectURL;
}