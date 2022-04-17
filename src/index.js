/** HOME BUTTON */
let homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', function() {
    //HIDE ALL
    document.getElementById('anime_div').style.display = 'none';
    document.getElementById('my_animes_div').style.display = 'none';

    //DISPLAY SEARCH
    document.getElementById('search_div').style.display = 'initial';
});


/** MY ANIMES BUTTON */
let myAnimeButton = document.getElementById('myAnimeButton');
myAnimeButton.addEventListener('click', function() {
    //HIDE ALL
    document.getElementById('anime_div').style.display = 'none';
    document.getElementById('search_div').style.display = 'none';

    //DISPLAY SEARCH
    document.getElementById('my_animes_div').style.display = 'initial';
    showMyAnimes();
});


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

/** BUTTON ADD EPISODE */
let btnEpisode = document.getElementById('episodeButton');
btnEpisode.addEventListener('click', function() {

    AddOrUpdateAnime(document.getElementById('episodeInput').value, document.getElementById('animeId').value, document.getElementById('animeTitle').value)
});


/** INPUT ADD ANIME */
let inputEpisode = document.getElementById('episodeInput');
inputEpisode.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("episodeButton").click();
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
            let itemsProcessed = 0;

            console.log(datas)

            datas.forEach(function (item) {
                itemsProcessed++;
                resultDom.innerHTML +=
                    '<div class="anime_'+ item.mal_id +'">' +
                        '<span id="'+item.mal_id+'" class="mr-2">' +
                            item.title +
                        '</span>' +
                        '<button id="addAnim00e_'+ item.mal_id +'" value="'+item.mal_id+'" class="addAnimeBtn bg-red-500 rounded px-1 text-white">+</button>' +
                    '</div>'

            });
            btnAnimeClickable();
        });

}

function btnAnimeClickable()
{
    document.querySelectorAll('.addAnimeBtn').forEach(item => {
        item.addEventListener('click', event => {
            //HIDE ANIME SEARCH + DISPLAY ANIME
            document.getElementById('search_div').style.display = 'none'
            document.getElementById('anime_div').style.display = 'initial'
            showAnime(item.value);
        })
    })

}

function showAnime(mlId)
{
    const url = 'https://api.jikan.moe/v4/anime/' + mlId;

    let resultAnime = document.getElementById('animesResult');
    resultAnime.innerHTML = '';

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let anime = data.data;
            resultAnime.innerHTML += '<a href="'+anime.url+'" target="_blank" class="text-2xl font-semibold">'+anime.title+'</a>' +
                '<img class="mx-auto" src="'+anime.images.jpg.image_url+'" />' +
                '<p>Episodes : '+ anime.episodes +'</p>' +
                '<input type="hidden" id="animeId" value="'+anime.mal_id+'">' +
                '<input type="hidden" id="animeTitle" value="'+anime.title+'">' +
                '<br />';
        });
}


function AddOrUpdateAnime(episode, id, title) {

    //CHECK IF STORAGE IS EMPTY
    chrome.storage.sync.get(function (result) {
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            //CREATE STORAGE VAR

            let animes = [];
            let anime = {
                id: id,
                title: title,
                episode: episode
            }
            animes.push(anime)

            chrome.storage.sync.set({animes});

        } else {
            //ADD TO STORAGE VARS

            let animes = result.animes;
            let anime = {
                id: id,
                title: title,
                episode: episode
            }

            //remove animes already in list
            animes = animes.filter(function(value, index, arr){
                return value.id !== anime.id;
            });
            animes.push(anime)

            chrome.storage.sync.set({animes});
        }

        //go to my animes page
        showMyAnimes()
    })
}

function showMyAnimes()
{
    document.getElementById('search_div').style.display = 'none';
    document.getElementById('anime_div').style.display = 'none';
    document.getElementById('my_animes_div').style.display = 'initial';

    let animesList = document.getElementById('my_animes');
    animesList.innerHTML = '';

    chrome.storage.sync.get(function (result) {
        result.animes.forEach(item => {
            animesList.innerHTML += '<div>' +
                '<div id="anime_'+item.id+'"> ' +
                '<div class="flex flex-row gap-1">' +
                '<h3 class="font-semibold">' + item.title + '</h3>' +
                '<button id="removeAnime_'+ item.id +'" value="'+item.id+'" class="removeAnimeBtn bg-red-500 rounded px-1 text-white">x</button>' +
                '</div>' +
                '<p>last watched episode : <span id="episodeFor_'+item.id+'">' + item.episode + '</span></p>' +
                '<button id="minusAnimeBtn_'+ item.id +'" value="'+item.id+'" class="minusAnimeBtn bg-red-500 mx-1 rounded px-1 text-white">-</button>' +
                '<button id="plusAnimeBtn'+ item.id +'" value="'+item.id+'" class="plusAnimeBtn bg-red-500 mx-1 rounded px-1 text-white">+</button>' +
                '<br />' +
                '</div>' +
                '<br />'
        });
        btnAnimeRemove();
        btnAnimePlus();
        btnAnimeMinus();
    });

}

function btnAnimeRemove()
{
    document.querySelectorAll('.removeAnimeBtn').forEach(item => {
        item.addEventListener('click', event => {
            removeAnimeFromList(item.value);
        })
    })
}

function removeAnimeFromList(id)
{
    chrome.storage.sync.get(function (result) {
        let animes = result.animes;

        animes = animes.filter(function(value, index, arr){
            return value.id !== id;
        });

        chrome.storage.sync.set({animes});
    });

    //document.getElementById('anime_'+ id).remove()
    showMyAnimes();
}


function btnAnimePlus()
{
    document.querySelectorAll('.plusAnimeBtn').forEach(item => {
        item.addEventListener('click', event => {
            AddOneEpisode(item.value);
        })
    })
}

function btnAnimeMinus()
{
    document.querySelectorAll('.minusAnimeBtn').forEach(item => {
        item.addEventListener('click', event => {
            RemoveOneEpisode(item.value);
        })
    })
}

function AddOneEpisode(id)
{
    chrome.storage.sync.get(function (result) {
        let animes = result.animes;

        animes.forEach(function (item) {
            if(item.id === id)
            {
                item.episode = Number(item.episode) + 1;
            }
        })

        chrome.storage.sync.set({animes});
    });
    let result = document.getElementById('episodeFor_'+ id).textContent;
    document.getElementById('episodeFor_'+ id).textContent = Number(result) + 1;
}

function RemoveOneEpisode(id)
{
    chrome.storage.sync.get(function (result) {
        let animes = result.animes;

        animes.forEach(function (item) {
            if(item.id === id)
            {
                item.episode = Number(item.episode) - 1;
            }
        })

        chrome.storage.sync.set({animes});
    });
    let result = document.getElementById('episodeFor_'+ id).textContent;
    document.getElementById('episodeFor_'+ id).textContent = Number(result) - 1;
}