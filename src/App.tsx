import Layout from './components/Layout';

function App() {
  // The App component's only responsibility is to render the main Layout.
  // The Layout component, in turn, will render the <Outlet> where all your
  // pages (HomePage, SearchPage, etc.) will be displayed.
  return (
    <Layout />
  );
}


export default App;
