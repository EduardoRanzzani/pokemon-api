import './App.css';
import React from 'react';
import PokemonList from './components/Pokemon/List';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

function App() {

  return (
    <div className="content">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact={true} component={PokemonList} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
