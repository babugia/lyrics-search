import React, { useState, useContext, memo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MyContext, types } from '../../App';

import './styles.css';

export default memo(function Header() {
  const { dispatch } = useContext(MyContext);
  const [searchInput, setSearchInput] = useState('');
  const history = useHistory();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: types.searchedSong,
      payload: { song: searchInput.trim() },
    });
    // TODO: use <Link to='/songs/:${searchInput.trim()} />', and remove this action from redux
    history.push('songs');
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

  return (
    <header>
      <h1>Buscar letras</h1>
      <form id='form' onSubmit={handleFormSubmit}>
        {renderSearchSongInput()}
        <button>Buscar</button>
      </form>
    </header>
  );
});
