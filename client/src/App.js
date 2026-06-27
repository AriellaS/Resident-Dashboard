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
import ForgotPw from '~/forgotpw/ForgotPw';
import Profile from '~/profile/Profile';
import Eval from '~/eval/Eval';
import Verify from '~/verify/Verify';
import Performance from '~/performance/Performance';
import Metrics from '~/metrics/Metrics';
import PrivateRoute from '~/PrivateRoute';

const App = () => {

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
                    path="/metrics"
                    element={<PrivateRoute verificationRequired pwChangeRequired adminRequired component={Metrics} />}
                />
                <Route
                    exact
                    path="/verify"
                    element={<PrivateRoute component={Verify} />}
                />
                <Route
                    exact
                    path="/changepw" // For when user is logged in but requires password change
                    element={<PrivateRoute verificationRequired component={ChangePw} />}
                />
                <Route
                    exact
                    path="/forgotpw"
                    element={<ForgotPw />}
                />
                <Route
                    path="/changepw/token/:token" // For when user unable to log in, access using password reset link
                    element={<ChangePw />}
                />
                <Route
                    exact
                    path="/login"
                    element={<Login />}
                />
                <Route
                    exact
                    path="/signup"
                    element={<Signup />}
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
