import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

import Home from  '~/home/Home';
import Login from  '~/login/Login';
import Signup from  '~/login/Signup';
import Profile from '~/profile/Profile';
import Eval from '~/eval/Eval';
import PrivateRoute from '~/PrivateRoute';
import useToken from '~/useToken';

const App = () => {

    const { token, setToken } = useToken();

    return (
        <Router>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={<PrivateRoute isAuthenticated={!!token} component={Home} />}
                />
                <Route
                    path="/users/:id"
                    element={<PrivateRoute isAuthenticated={!!token} component={Profile} />}
                />
                <Route
                    path="/users/:id/eval"
                    element={<PrivateRoute isAuthenticated={!!token} component={Eval} />}
                />
                <Route
                    exact
                    path="/login"
                    element={<Login setToken={setToken} />}
                />
                <Route
                    exact
                    path="/signup"
                    element={<Signup setToken={setToken} />}
                />
            </Routes>
        </Router>
    )
}

export default App;
