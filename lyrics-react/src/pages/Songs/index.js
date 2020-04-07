import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  memo,
  Fragment,
} from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { MyContext, types } from '../../App';
import Loader from '../../utils/components/Loader';
import './styles.css';

const Songs = () => {
  const { state, dispatch } = useContext(MyContext);
  const { song: searchedSong } = useParams();
  const [showWarningMessage, setShowWarningMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { songs, prev, next, loading } = state;

  const getMoreSongs = async (url) => {
    setShowWarningMessage(false);
    dispatch({ type: types.loading, payload: true });
    const response = await api.get(
      `https://cors-anywhere.herokuapp.com/${url}`
    );
    const { data } = response;
    const { data: newSongs, next, prev } = data;
    dispatch({ type: types.songs, payload: { newSongs, prev, next } });
    newSongs.length
      ? setShowWarningMessage(false)
      : setShowWarningMessage(true);
  };

  const fetchSongs = useCallback(async () => {
    setShowErrorMessage(false);
    try {
      if (searchedSong) {
        setShowWarningMessage(false);
        dispatch({ type: types.loading, payload: true });
        const response = await api.get(`suggest/${searchedSong}`);
        const { data } = response;
        const { data: newSongs, next, prev } = data;
        dispatch({ type: types.songs, payload: { newSongs, prev, next } });
        newSongs.length
          ? setShowWarningMessage(false)
          : setShowWarningMessage(true);
      }
    } catch (error) {
      setShowErrorMessage(true);
      dispatch({ type: types.loading, payload: false });
    }
  }, [searchedSong, dispatch]);

  useEffect(() => {
    if (searchedSong) fetchSongs();
  }, [searchedSong, fetchSongs]);

  const ErrorMessage = ({ message }) => (
    <h3 className='warning-message'>{message}</h3>
  );

  const LyricsButton = ({ artistName, songTitle }) => (
    <Link to={`/lyrics/${artistName}/${songTitle}`}>
      <button className='btn'>Ver letra</button>
    </Link>
  );

  const SongName = ({ artistName, songTitle }) => (
    <span className='song-artist'>
      <strong>{artistName}</strong> - {songTitle}
    </span>
  );

  const SongRow = ({ artistName, songTitle }) => {
    return (
      <li className='song'>
        <SongName artistName={artistName} songTitle={songTitle} />
        <LyricsButton artistName={artistName} songTitle={songTitle} />
      </li>
    );
  };

  const PrevButton = () => (
    <button className='btn' onClick={() => getMoreSongs(prev)}>
      Anteriores
    </button>
  );

  const NextButton = () => (
    <button className='btn' onClick={() => getMoreSongs(next)}>
      Próximas
    </button>
  );

  const shouldRenderButtons = (prev || next) && !loading;

  return (
    <Fragment>
      {loading && <Loader loading={loading} />}
      {showWarningMessage && (
        <ErrorMessage message='Nenhuma música encontrada, tente novamente!' />
      )}
      {showErrorMessage && (
        <ErrorMessage message='Aconteceu algum problema.. Tente novamente mais tarde!' />
      )}
      {songs.length && !loading && (
        <ul className='songs-container'>
          {songs.map((song, index) => (
            <SongRow
              key={index}
              artistName={song.artist.name}
              songTitle={song.title}
            />
          ))}
        </ul>
      )}
      {shouldRenderButtons && (
        <div className='prev-and-next-container'>
          {prev && PrevButton()}
          {next && NextButton()}
        </div>
      )}
    </Fragment>
  );
};

export default memo(Songs);
