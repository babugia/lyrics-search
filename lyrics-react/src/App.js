import React, { memo } from 'react';
import Routes from './routes';
import './global.css';

export const types = {
  loading: 'LOADING',
  songs: 'SONGS_FETCHED',
  searchedSong: 'SEARCHED_SONG',
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
  return <Routes />;
}

export default memo(() => (
  <MyProvider>
    <App />
  </MyProvider>
));

// TODO: separate context and reducer logic from here
