import {useHttp} from '../components/hooks/http.hook';

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKeyCharacters = 'apikey=96ce4d3794493af3061efba246406ac5';
    const _apiKeyComics = 'apikey=96ce4d3794493af3061efba246406ac5';
    const _baseOffset = 210;
    const {request, loading, error, clearError} = useHttp();

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKeyCharacters}`);
        console.log(res.data)
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKeyCharacters}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKeyComics}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKeyComics}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
            active: false
        }
    }

    const _transformComics = (comic) => {
        return {
            id: comic.id,
            name: comic.series.name,
            price: comic.prices[0].price ? `${comic.prices[0].price}$` : 'NOT AVALIABLE',
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            homepage: comic.urls[0].url,
            description: comic.description ? comic.description : 'There is no description for this comic',
            pageCount: comic.pageCount,
            language: comic.textObjects.language || 'en-us'
        }
    }

    return {loading, error, getAllCharacters, getCharacter, getAllComics, getComic, clearError}
}

export default useMarvelService;