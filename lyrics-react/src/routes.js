import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './pages/Header';
import Songs from './pages/Songs';

export default function Routes() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path='/songs/:song' exact component={Songs} />
          {/* <Route path='/incidents/new' component={NewIncident} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

// TODO: /songs/:song

// TODO: try to do /lyrics route with artistName and songTitle as parameter,
// instead save them in redux
