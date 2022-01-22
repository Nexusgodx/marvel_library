import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppBanner from '../appBanner/AppBanner';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';


const ComicsList = () => {
    const [comics, setComics] = useState([]),
          [newItemLoaded, setNewItemLoaded] = useState(false),  
          [offset, setOffset] = useState(210),
          {loading, error, getAllComics} = useMarvelService();  


    useEffect(() => {
        getAllComics(offset)
            .then(data => {
                setComics([...comics, ...data])
                setNewItemLoaded(false);
            })
    }, [offset])

    const onLoadMore = () => {
        setOffset(offset => offset + 8);
        setNewItemLoaded(true);
    }


    const content = <View comics={comics}/> ? <View comics={comics}/> : null;
    const spinner = (loading && !error && !newItemLoaded) ? <Spinner/> : null;
    const errorMessage = (!loading && error && !content) ? <ErrorMessage/> : null;

    return (
        <>
            <div className="comics__list">
                {content}
                {spinner}
                {errorMessage}
            <button disabled={newItemLoaded} onClick={onLoadMore} className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
        </>
    )
}

const View = ({comics}) => {
    console.log(comics)
    return (
        <ul className="comics__grid">
            {comics.map(({id, name, price, thumbnail, homepage}) => {
            return <li key={id} className="comics__item">
                        <Link to={`/comics/${id}`}>
                            <img src={thumbnail} alt="ultimate war" className="comics__item-img"/>
                            <div className="comics__item-name">{name}</div>
                            <div className="comics__item-price">{price}</div>
                        </Link>
                    </li>
            })}
        </ul>
    )
}

export default ComicsList;