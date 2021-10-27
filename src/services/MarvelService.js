

export default class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=96ce4d3794493af3061efba246406ac5'

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=200&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?&${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (result) => {
        

        return {
            name: result.name,
            description: this._transformDescription(result.description) ,
            thumbnail: result.thumbnail.path + '.' + result.thumbnail.extension,
            homepage: result.urls[0].url,
            wiki: result.urls[1].url
        }
    }

    _transformDescription = (str) => {
        if (!str) {
            return 'Description not found ;C';
        } else if (str.length > 200) {
          return str.substr(0, 200) + '...';
        } else {
            return str;
        }
    }
}