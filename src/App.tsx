//import logo from './logo.svg';
import './App.css';
import Admin from './components/Admin';
import ArrangerandeKlubbar from './components/ArrangerandeKlubbar';
import Home from './components/Home';
import TidigareProgram from './components/TidigareProgram';

const App = (): JSX.Element => {
   let page = window.location.href;
   if (page.includes('tidigareprogram')) {
      return <TidigareProgram isAdmin={false} />;
   } else if (page.includes('arrangerandeklubbar')) {
      return <ArrangerandeKlubbar isAdmin={false} />;
   } else if (page.includes('admin') || page.includes('login')) {
      return <Admin />;
   } else {
      return <Home />;
   }
};

export default App;
