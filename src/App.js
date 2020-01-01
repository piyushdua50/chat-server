import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Buttons } from './components';
import { UserDetails } from '../src/UserDetails';
import { SnackBarProvider } from './contexts';

const App = () => (
  <>
    <SnackBarProvider>
      <Router>
        <Route exact path='/' component={Buttons} />
        <Route path='/UserList/:name' component={UserDetails} />
      </Router>
    </SnackBarProvider>
  </>
);
export default App;
