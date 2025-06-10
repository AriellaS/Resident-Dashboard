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
import Verify from '~/verify/Verify';
import Performance from '~/performance/Performance';
import PrivateRoute from '~/PrivateRoute';
import useToken from '~/useToken';
import useCurrentUser from '~/useCurrentUser';

const App = () => {

    const { setToken } = useToken();
    const { setCurrentUser } = useCurrentUser();

    return (
        <Router>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={<PrivateRoute needsEmailVerif component={Home} />}
                />
                <Route
                    path="/users/:id"
                    element={<PrivateRoute needsEmailVerif component={Profile}/>}
                />
                <Route
                    path="/users/:id/eval"
                    element={<PrivateRoute needsEmailVerif component={Eval} />}
                />
                <Route
                    path="/users/:id/performance"
                    element={<PrivateRoute needsEmailVerif component={Performance} />}
                />
                <Route
                    exact
                    path="/verify"
                    element={<PrivateRoute needsEmailVerif={false} component={Verify} setCurrentUser={setCurrentUser} />}
                />
                <Route
                    exact
                    path="/login"
                    element={<Login setToken={setToken} setCurrentUser={setCurrentUser}/>}
                />
                <Route
                    exact
                    path="/signup"
                    element={<Signup setToken={setToken} setCurrentUser={setCurrentUser}/>}
                />
            </Routes>
        </Router>
    )
}

export default App;
