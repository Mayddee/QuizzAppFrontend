import React, {useContext, useMemo} from 'react';
import { useNavigate} from 'react-router-dom';
import './Header.css'; 
import { AuthContext } from '../App';



const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate('/');
    };
  
    const buttons = useMemo(() => (
      <>
        <button onClick={() => navigate('/home')}>Home</button>
        {user && <button onClick={() => navigate('/my-quizzes')}>My Quizzes</button>}

        {!user ? (
          <>
            <button  onClick={() => navigate('/signin')}>Login</button>
            <button  onClick={() => navigate('/signup')}>Signup</button>
          </>
        ) : (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </>
    ), [navigate, user]);
  
    return (
      <header className="header">
        <div className="logo" onClick={() => navigate('/home')}>
          {/* <img src="https://icons.veryicon.com/png/o/miscellaneous/face-monochrome-icon/calendar-249.png" alt="Logo" /> */}
          <h1>QuizMeUp</h1>
        </div>
        <nav>{buttons}</nav>
      </header>
    );
  };
  

export default Header;