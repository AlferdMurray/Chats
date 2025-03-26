import { Provider } from 'react-redux';
import './App.css';
import Chat from './Components/Chat';
import Login from './Components/Login';
import SignIn from './Components/Signin'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Router, Routes, Navigate } from 'react-router-dom'
import { store } from './Store/store';
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './Components/ErrorUI';
function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback} >
            <Routes>
              <Route path='/chat' element={<Chat />} ></Route>
              <Route path='/signin' element={<SignIn />} ></Route>
              <Route path='/login' element={<Login />} ></Route>
              <Route path='*' element={<Navigate to="/login" />} ></Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
