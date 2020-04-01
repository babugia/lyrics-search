import React, { useState } from 'react';
import { css } from '@emotion/core';
import FadeLoader from 'react-spinners/FadeLoader';
import api from './services/api';
import './global.css';
import './App.css';

const loadingStyle = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [next, setNext] = useState('');
  const [prev, setPrev] = useState('');

  const fetchSongs = async () => {
    const trimmedInput = searchInput.trim();
    if (trimmedInput) {
      setLoading(true);
      const response = await api.get(`suggest/${trimmedInput}`);
      setSongs(response.data);
      setSearchInput('');
      response.data.next ? setNext(response.data.next) : setNext('');
      response.data.prev ? setPrev(response.data.prev) : setPrev('');
      setLoading(false);
    }
  };

  const getMoreSongs = async url => {
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

  const handleFormSubmit = event => {
    event.preventDefault();
    fetchSongs();
  };

  const handleVerLetraClick = async ({ name, title }) => {
    setLoading(true);
    const response = await api.get(`v1/${name}/${title}`);
    const {
      data: { lyrics }
    } = response;
    if (lyrics) {
      setLyrics(lyrics);
      setName(name);
      setTitle(title);
      setSongs([]);
    } else {
      setLyrics('');
      setName('');
      setTitle('');
    }
    setLoading(false);
  };

  const gamb = text => {
    if (!text) return <br></br>;
    return text;
  };

  return (
    <>
      <header>
        <h1>Buscar letras</h1>
        <form id='form' onSubmit={handleFormSubmit}>
          <input
            id='search'
            type='text'
            value={searchInput}
            onChange={evt => setSearchInput(evt.target.value)}
            placeholder='Insira o nome do artista ou da música...'
          />
          <button>Buscar</button>
        </form>
      </header>
      <ul className='songs-container songs'>
        {loading && (
          <FadeLoader
            css={loadingStyle}
            size={150}
            color={'#8d56fd'}
            loading={loading}
          />
        )}
        {songs.data && !loading
          ? songs.data.map(({ artist: { name }, title }, index) => (
              <li key={index} className='song'>
                <span className='song-artist'>
                  <strong>{name}</strong> - {title}
                </span>
                <button
                  className='btn'
                  onClick={() => handleVerLetraClick({ name, title })}
                >
                  Ver letra
                </button>
              </li>
            ))
          : lyrics && (
              <li className='lyrics-container'>
                <h2>
                  <strong>{title}</strong> - {name}
                </h2>
                <div className='lyrics'>
                  {lyrics.split('\n').map((text, index) => (
                    <p key={index}>{gamb(text)}</p>
                  ))}
                </div>
              </li>
            )}
        }
      </ul>
      <div className='prev-and-next-container'>
        {prev && (
          <button className='btn' onClick={() => getMoreSongs(prev)}>
            Anteriores
          </button>
        )}
        {next && (
          <button className='btn' onClick={() => getMoreSongs(next)}>
            Próximas
          </button>
        )}
      </div>
    </>
  );
}

export default App;

// TODO: refactor this shit, search how to use new features from ES2020
