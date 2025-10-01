import './App.css'
import { BrowserRouter } from 'react-router-dom';
import Approutes from './routes/Approutes';

export const App = () => (
  <BrowserRouter>
    <Approutes />
  </BrowserRouter>
);

export default App
