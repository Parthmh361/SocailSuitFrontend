import axios from 'axios';
axios.defaults.withCredentials = true;
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';

import { store } from './store';
import { Provider } from 'react-redux';
import Homepage from './components/Homepage';
import Schedule from './components/Schedule';
import Login from './components/Login_page';

import YouTubeDashboard from './components/YouTubeDashboard'; 
import UploadForm from './components/UploadForm';
import Analytics from './components/Analytics';
import GoogleLoginButton from './components/GoogleLogin';
axios.defaults.withCredentials = true;
const App = () => {
  return(
     <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/google" element={<GoogleLoginButton />} />
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home/>} />
        <Route path= "/Analytics" element = {<Analytics/>} />
        <Route path="/Homepage" element= {<Homepage />} />
        <Route path='/schedulePost' element={<Schedule />}/>
        <Route path="/youtube" element={<YouTubeDashboard />} />
        <Route path="/yts" element={<UploadForm/>}/>
      </Routes>
    </Router>
    </Provider>
  );
};

export default App;
