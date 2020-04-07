import React, { useState, memo } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './styles.css';

const Header = () => {
  const [searchInput, setSearchInput] = useState('');
  const history = useHistory();

  const renderSearchSongInput = () => (
    <input
      id='search'
      type='text'
      value={searchInput}
      onChange={(evt) => setSearchInput(evt.target.value)}
      placeholder='Insira o nome do artista ou da música...'
    />
  );

  const handleKeyPress = (target) => {
    if (target.charCode === 13) {
      history.push(`/songs/${searchInput.trim()}`);
    }
  };

  return (
    <header>
      <h1>Buscar letras</h1>
      <div className='header-container' onKeyPress={(e) => handleKeyPress(e)}>
        {renderSearchSongInput()}
        <Link to={`/songs/${searchInput.trim()}`}>
          <button>Buscar</button>
        </Link>
      </div>
    </header>
  );
};

export default memo(Header);
