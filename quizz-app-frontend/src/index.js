import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SignupForm from './Pages/SignUpForm';
import SigninForm from './Pages/SigninForm';
import Content from './Pages/Content';
import QuizDetailPage from './Pages/QuizDetailPage.jsx';
import QuizStartPage from './Pages/QuizStartPage';
import MyQuizzesPage from './Pages/MyQuizzesPage';
import QuizEditPage from './Pages/QuizEditPage';
import QuizCreatePage from './Pages/QuizCreatePage';
import UserResultsPage from './Pages/UserResultsPage';
import CorrectAnswersPage from './Pages/CorrectAnswersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Content /> },
      { path: 'home', element: <Content /> },
      { path: 'signup', element: <SignupForm /> },
      { path: 'signin', element: <SigninForm /> },
      { path: 'quiz/:quizId', element: <QuizDetailPage /> },
      { path: 'quiz/:quizId/start', element: <QuizStartPage /> },
      { path: 'my-quizzes', element: <MyQuizzesPage /> },
      {
        path: 'quiz/:quizId/edit',
        element: <QuizEditPage />,
      },
      { path: 'quiz/create', element: <QuizCreatePage /> },
      { path: 'results/:attemptId', element: <UserResultsPage /> },
{ path: 'results/:attemptId/answers', element: <CorrectAnswersPage /> },

    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    </React.StrictMode>
  
);


reportWebVitals();
