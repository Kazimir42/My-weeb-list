
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

/** FUNCTION SEARCH LIST OF ANIMES */
function searchAnimes(text) {
    let resultDom = document.getElementById('animesSearchResult');
    resultDom.innerHTML = '';

    const url = 'https://api.jikan.moe/v4/anime?q=' + text;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let datas = data.data;

            console.log(datas)

            let itemsProcessed = 0;

            datas.forEach(function (item) {
                itemsProcessed++;
                resultDom.innerHTML +=
                    '<div class="anime_'+ item.mal_id +'">' +
                        '<span id="'+item.mal_id+'" class="mr-2">' +
                            item.title +
                        '</span>' +
                        '<button id="addAnime_'+ item.mal_id +'" class="addAnimeBtn bg-red-500 rounded px-1 text-white">+</button>' +
                    '</div>'

                if(itemsProcessed === datas.length) {
                    btnAnimeClickable();
                }
            });



        });

}


function btnAnimeClickable()
{
    /** INPUT BUTTON ANIME */
    let btnAnime =  document.getElementsByClassName('addAnimeBtn')
    console.log(btnAnime)
    btnAnime.addEventListener('click', function() {
        console.log(btnAnime)
    });
}
