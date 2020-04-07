import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './pages/Header';
import Songs from './pages/Songs';
import Lyrics from './pages/Lyrics';

export default function Routes() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path='/songs/:song' exact component={Songs} />
          <Route path='/lyrics/:artist/:song' exact component={Lyrics} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
