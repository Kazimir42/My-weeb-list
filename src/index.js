

/** BUTTON SEARCH ANIME */
let btn = document.getElementById('searchButton');
btn.addEventListener('click', function() {
    searchAnimes(document.getElementById('searchInput').value)
});


/** INPUT SEARCH ANIME */
let input = document.getElementById('searchInput');
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
});

function searchAnimes(text) {
    let resultDom = document.getElementById('animesSearchResult');
    resultDom.innerHTML = '';

    const url = 'https://api.jikan.moe/v4/anime?q=' + text;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let datas = data.data;

            datas.forEach(function (item) {
                resultDom.innerHTML +=
                    '<div class="">' +
                    item.title +
                    '</div>'
            });
        });

}

async function newSearch(text) {
    try {
        await searchAnimes(text);
    } catch (err) {
        console.log(err);
    }
}