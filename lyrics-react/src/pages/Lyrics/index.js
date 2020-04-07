import React, { memo, useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { MyContext, types } from '../../App';
import Loader from '../../utils/components/Loader';
import './styles.css';

const Lyrics = () => {
  const { artist, song } = useParams();
  const { state, dispatch } = useContext(MyContext);
  const history = useHistory();
  const [lyrics, setLyrics] = useState('');

  const { loading } = state;

  const getLyrics = async () => {
    dispatch({ type: types.loading, payload: true });
    try {
      const response = await api.get(`v1/${artist}/${song}`);
      const {
        data: { lyrics },
      } = response;
      if (lyrics) {
        setLyrics(lyrics);
      }
    } catch (err) {
      alert('Letra não encontrada...');
      setLyrics('');
    }
    dispatch({ type: types.loading, payload: false });
  };

  useEffect(() => {
    if (artist && song) getLyrics();

    return () => setLyrics('');
  }, []);

  const formatedLyrics = (text) => {
    if (!text) return <br></br>;
    return text;
  };

  return (
    <>
      <FiArrowLeft
        size={24}
        color='#8d56fd'
        onClick={() => history.goBack()}
        className='back-button'
      />
      <div className='lyrics-container'>
        {loading && <Loader loading={loading} />}

        {lyrics && (
          <h2>
            <strong>{artist}</strong> - {song}
          </h2>
        )}
        <div className='lyrics'>
          {lyrics.split('\n').map((text, index) => (
            <p key={index}>{formatedLyrics(text)}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(Lyrics);
