import React, { useContext } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import Login from "./components/Login";
import Feeds from "./components/Feeds"
import Profile from "./components/Profile"
import Signup from './components/Signup';
import { AuthContext, AuthProvider } from './context/AuthProvider';

function App() {
  let { currentUser } = useContext(AuthContext);
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header></Header>
          <Switch>
            {currentUser ? (<>
              <Route path="/" component={Feeds} exact></Route>
              <Route path="/profile" component={Profile}></Route>
              <Redirect to="/"></Redirect>
            </>) : (<>
              <Route path="/login" component={Login} exact></Route>
              <Route path="/signup" component={Signup} exact></Route>
              <Redirect to="/login"></Redirect>
            </>)
            }
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

// function PrivateRoute(props) {
//   let { comp: component, path } = props;
//   let { currentUser } = useContext(AuthContext);
//   return currentUser ? (
//     <Route path={path} component={component}></Route>
//   ) : (
//     <Redirect to="/login"></Redirect>
//   )
// }

export default App;
