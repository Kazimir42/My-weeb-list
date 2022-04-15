

function searchAnimes(text)
{
    resultDom = document.getElementById('animesSearchResult');
    axios.get('https://api.jikan.moe/v4/anime?q=' + text).then(resp => {

        let datas = resp.data;


        datas.data.forEach(function (item) {
            resultDom.innerHTML +=
                '<div class="">' +
                item.title +
                '</div>'

        });

    });
}