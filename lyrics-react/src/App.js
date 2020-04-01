import React, { useState } from 'react';
import api from './services/api';
import './global.css';
import './App.css';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    const trimmedInput = searchInput.trim();
    if (trimmedInput) {
      const response = await api.get(`suggest/${trimmedInput}`);
      setSongs(response.data);
      setSearchInput('');
    }
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    fetchSongs();
  };

  const handleVerLetraClick = async ({ name, title }) => {
    const data = await api.get(`v1/${name}/${title}`);
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
        {songs.data ? (
          songs.data.map(({ artist: { name }, title }) => (
            <li className='song'>
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
        ) : (
          <></>
        )}
      </ul>
    </>
  );
}

export default App;
