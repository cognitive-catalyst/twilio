
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import App from 'components/app';
import Home from 'components/home';
import './style.scss';

render ((
    <Router history={browserHistory}>
        <Route component={App}>
            <Route path='/' component={Home} />
        </Route>
    </Router>
), document.getElementById("root"));
