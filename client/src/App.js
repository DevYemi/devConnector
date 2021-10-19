import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Register from './components/auth/Register';
import Login from './components/auth/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path='/' component={Landing} />
          <>
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
          </>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
