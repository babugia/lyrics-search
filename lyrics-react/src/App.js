import React, { useState, Fragment, useEffect, memo } from 'react';
import api from './services/api';
import Routes from './routes';
import './global.css';
import './App.css';

export const types = {
  loading: 'LOADING',
  songs: 'SONGS_FETCHED',
  searchedSong: 'SEARCHED_SONG',
  cleanLyrics: 'CLEAN_LYRICS_PAGE',
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.loading:
      return { ...state, loading: payload };
    case types.songs:
      return {
        ...state,
        loading: false,
        songs: payload.newSongs,
        prev: payload.prev,
        next: payload.next,
      };
    case types.cleanLyrics:
      return {
        ...state,
        artistName: '',
        songTitle: '',
        lyrics: '',
      };
    default:
      return { ...state };
  }
};

export const MyContext = React.createContext();

function MyProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, {
    loading: false,
    prev: '',
    next: '',
    songs: [],
    artistName: '',
    songTitle: '',
    lyrics: '',
  });

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      {children}
    </MyContext.Provider>
  );
}

//

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [next, setNext] = useState('');
  const [prev, setPrev] = useState('');
  const [notFound, setNotFound] = useState(false);

  const fetchSongs = async () => {
    const trimmedInput = searchInput.trim();
    if (trimmedInput) {
      setLoading(true);
      const response = await api.get(`suggest/${trimmedInput}`);
      if (response.data.total > 0) {
        setSongs(response.data);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setSearchInput('');
      response.data.next ? setNext(response.data.next) : setNext('');
      response.data.prev ? setPrev(response.data.prev) : setPrev('');
      setLoading(false);
    }
  };

  const getMoreSongs = async (url) => {
    setLyrics('');
    setSongs([]);
    setLoading(true);
    const response = await api.get(
      `https://cors-anywhere.herokuapp.com/${url}`
    );
    const { data } = response;
    const { prev, next } = data;

    setSongs(data);
    setNext(next);
    setPrev(prev);
    setLoading(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setLyrics('');
    fetchSongs();
  };

  const getLyrics = async (name, title) => {
    setLoading(true);
    try {
      const response = await api.get(`v1/${name}/${title}`);
      const {
        data: { lyrics },
      } = response;
      if (lyrics) {
        setLyrics(lyrics);
        setName(name);
        setTitle(title);
        setSongs([]);
      }
    } catch (err) {
      alert('Letra não encontrada...');
      setLyrics('');
      setName('');
      setTitle('');
    }
    setLoading(false);
  };

  const formatadLyrics = (text) => {
    if (!text) return <br></br>;
    return text;
  };

  const renderSearchSongInput = () => (
    <input
      id='search'
      type='text'
      value={searchInput}
      onChange={(evt) => setSearchInput(evt.target.value)}
      placeholder='Insira o nome do artista ou da música...'
    />
  );

  const renderLyricsButton = (artistName, songTitle) => (
    <button className='btn' onClick={() => getLyrics(artistName, songTitle)}>
      Ver letra
    </button>
  );

  const renderSongName = (artistName, songTitle) => (
    <span className='song-artist'>
      <strong>{artistName}</strong> - {songTitle}
    </span>
  );

  const renderSongRow = (artistName, songTitle, index) => {
    return (
      <li key={index} className='song'>
        {renderSongName(artistName, songTitle)}
        {renderLyricsButton(artistName, songTitle)}
      </li>
    );
  };

  const renderPrevButton = () => {
    return prev ? (
      <button className='btn' onClick={() => getMoreSongs(prev)}>
        Anteriores
      </button>
    ) : (
      <Fragment />
    );
  };

  const renderNextButton = () => {
    return next ? (
      <button className='btn' onClick={() => getMoreSongs(next)}>
        Próximas
      </button>
    ) : (
      <Fragment />
    );
  };

  const renderLyrics = () => {
    return lyrics ? (
      <li className='lyrics-container'>
        <h2>
          <strong>{title}</strong> - {name}
        </h2>
        <div className='lyrics'>
          {lyrics.split('\n').map((text, index) => (
            <p key={index}>{formatadLyrics(text)}</p>
          ))}
        </div>
      </li>
    ) : (
      <Fragment />
    );
  };

  return (
    <Routes />
    // <Fragment>
    //   <header>
    //     <h1>Buscar letras</h1>
    //     <form id='form' onSubmit={handleFormSubmit}>
    //       {renderSearchSongInput()}
    //       <button>Buscar</button>
    //     </form>
    //   </header>
    //   <ul className='songs-container songs'>
    //     {renderNotFoundMessage()}
    //     {renderLoader()}
    //     {songs.data && !loading
    //       ? songs.data.map(({ artist: { name }, title }, index) =>
    //           renderSongRow(name, title, index)
    //         )
    //       : renderLyrics()}
    //     }
    //   </ul>

    //   <div className='prev-and-next-container'>
    //     {renderPrevButton()}
    //     {renderNextButton()}
    //   </div>
    // </Fragment>
  );
}

export default memo(() => (
  <MyProvider>
    <App />
  </MyProvider>
));

// TODO: search how to use new features from ES2020
