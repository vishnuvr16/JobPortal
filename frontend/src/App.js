import './App.css';
import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify"
import PageLayout from './components/PageLayout';

function App() {
  return (
    <>
      <div className='bg-gray-300'>
        <ToastContainer position='top-center' />

        <PageLayout>
          <Outlet />
        </PageLayout>
      </div>
    </>
  );
}

export default App;
