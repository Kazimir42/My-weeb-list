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
            console.log(anime)
            resultAnime.innerHTML += '<a href="'+anime.url+'" target="_blank" class="text-2xl font-semibold">'+anime.title+'</a>' +
                '<img class="mx-auto" src="'+anime.images.jpg.image_url+'" />' +
                '<p>Episodes : '+ anime.episodes +'</p>' +
                '<input type="hidden" id="animeId" value="'+anime.mal_id+'">' +
                '<input type="hidden" id="animeTitle" value="'+anime.title+'">' +
                '<br />';
        });
}


function AddOrUpdateAnime(episode, id, title)
{

    //CHECK IF STORAGE IS EMPTY
    chrome.storage.sync.get(function(result){
        if (Object.keys(result).length === 0 && result.constructor === Object)
        {
            //CREATE STORAGE VAR
            console.log('empty')

            let animes = [];
            let anime = {
                id: id,
                title: title,
                episode: episode
            }
            animes.push(anime)

            chrome.storage.sync.set({animes}, function() {
                console.log('add ' + anime);
            });

        }else{
            //ADD TO STORAGE VARS
            console.log('plein')
            console.log(result)

            let animes = result.animes;
            let anime = {
                id: id,
                title: title,
                episode: episode
            }
            animes.push(anime)


            chrome.storage.sync.set({animes}, function() {
                console.log('add ' + anime);
            });

        }
    })

    /*
    //IF USER HAVE ANIMES
    if (chrome.storage.sync.get())
    {
        chrome.storage.sync.get(['animes'], function(result) {
            console.log('Value currently is ' + result.key);
        });
    }else { //ELSE
        let anime = {
            id: id,
            title: title,
            episode: episode
        }

        chrome.storage.sync.set({animes: [anime]}, function() {
            console.log('add ' + anime);
        });

        console.log( chrome.storage.sync.get(null, function(items) {
            var allKeys = Object.keys(items);
            console.log(allKeys);
        }));
    }*/


}


function CreateAnimesStorage()
{

}