import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]),
          [loading, setLoading] = useState(true),
          [error, setError] = useState(false),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(210),
          [charEnded, setCharEnded] = useState(false),
          myRef = useRef([]);  



    
    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' && e.target.classList.contains("char__item")) {
                e.target.click();
                console.log('click')
            }
        })

        return document.removeEventListener('keydown', (e) => {
            if (e.code === 'Enter' && e.target.classList.contains("char__item")) {
                e.target.click();
                console.log('click')
            }
        })
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setOffset((offset) => offset + 9);
        setCharList((charList) => ([...charList, ...newCharList]));
        setLoading(false);
        setCharEnded(ended);
        setNewItemLoading(false);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const onCharSelectedStyle = (i) => {
        console.log(myRef.current)
        myRef.current.forEach(item => {
            item.classList.remove('char__item_selected');
            myRef.current[i].classList.add('char__item_selected');
            myRef.current[i].focus();
        })
    }



    const renderItems = (arr) => {
        console.log(arr)
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    tabIndex={0}
                    ref={el => myRef.current[i] = el}
                    className="char__item"
                    key={item.id}
                    onClick={() => {
                       props.onCharSelected(item.id);
                        onCharSelectedStyle(i);
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    
        
        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;