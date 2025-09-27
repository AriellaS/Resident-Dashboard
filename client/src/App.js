import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Home from  '~/home/Home';
import Login from  '~/login/Login';
import Signup from  '~/login/Signup';
import ChangePw from '~/changepw/ChangePw';
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
                    element={<PrivateRoute verficationRequired pwChangeRequired component={Home} />}
                />
                <Route
                    path="/users/:id"
                    element={<PrivateRoute verificationRequired pwChangeRequired component={Profile}/>}
                />
                <Route
                    path="/users/:id/eval"
                    element={<PrivateRoute verificationRequired pwChangeRequired component={Eval} />}
                />
                <Route
                    path="/users/:id/performance"
                    element={<PrivateRoute verificationRequired pwChangeRequired component={Performance} />}
                />
                <Route
                    exact
                    path="/verify"
                    element={<PrivateRoute component={Verify} />}
                />
                <Route
                    exact
                    path="/changepw"
                    element={<PrivateRoute verificationRequired component={ChangePw} />}
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
                <Route
                    path="*"
                    element={<Navigate to='/' replace />}
                />
            </Routes>
        </Router>
    )
}

export default App;
