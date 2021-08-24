import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import Login from "./components/Login";
import Feeds from "./components/Feeds"
import Profile from "./components/Profile"
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Header></Header>
        <Switch>
          <Route path="/login" component={Login} exact></Route>
          <Route path="/signup" component={Signup} exact></Route>
          <Route path="/" component={Feeds} exact></Route>
          <Route path="/profile" component={Profile} exact></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
