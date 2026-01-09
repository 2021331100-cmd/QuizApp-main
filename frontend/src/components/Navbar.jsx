import React, { useState, useEffect } from 'react';
import { navbarStyles } from '../assets/dummyStyles.js';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Award, LogIn, LogOut, Menu, X, BookOpen, Plus, Trophy } from 'lucide-react';

const Navbar = ({logoSrc}) => {

  const navigate = useNavigate();
  const[loggedIn,setLoggedIn] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const [logoError,setLogoError] = useState(false);
  const fallbackLogo = "https://dummyimage.com/120x120/4f46e5/ffffff&text=QZ";
  const logoToUse = logoError ? fallbackLogo : (logoSrc || fallbackLogo);

  // useEffect hook to show the login state change

    useEffect(() => {
    try {
      const u = localStorage.getItem("authToken");
      setLoggedIn(!!u);
    } catch (e) {
      setLoggedIn(false);
    }

    const handler = (ev) => {
      const detailUser = ev?.detail?.user ?? null;
      setLoggedIn(!!detailUser);
    };
    window.addEventListener("authChanged", handler);

    return () => window.removeEventListener("authChanged", handler);
  }, []);

  // LOGOUT FUNCTION
  const handleLogout = () => {
    try{
      localStorage.removeItem("authToken");
      localStorage.clear();
    }catch(e){
      // Ignore all the error
    }
    window.dispatchEvent(
      new CustomEvent("authChanged",{detail:{user:null}})
    );
    setMenuOpen(false);
    try{
      navigate("/login");
    }catch(e){
      window.location.href = '/login';
    }
  };
  return (
    <nav className= {navbarStyles.nav}>
        <div
            style={{
                backgroundImage: navbarStyles.decorativePatternBackground,
            }}
            className={navbarStyles.decorativePattern}
        ></div>

        <div className={navbarStyles.bubble1}></div>
        <div className={navbarStyles.bubble2}></div>
        <div className={navbarStyles.bubble3}></div>

        <div className={navbarStyles.container}>
            <div className={navbarStyles.logoContainer}>
                 <Link to="/" className={navbarStyles.logoButton}>
            <div className={navbarStyles.logoInner}>
              <img
                src={logoToUse}
                alt="QuizApp logo"
                className={navbarStyles.logoImage}
                onError={() => setLogoError(true)}
              />
            </div>
          </Link>
            </div>

        <div className={navbarStyles.titleContainer}>
           <div className={navbarStyles.titleBackground}>
            <h1 className={navbarStyles.titleText}>TwoDimension Quiz Application</h1>
           </div>
        </div>

        <div className={navbarStyles.desktopButtonsContainer}>
          <div className={navbarStyles.spacer}></div>
          <NavLink to='/quizzes' className={navbarStyles.resultsButton}>
            <BookOpen className={navbarStyles.buttonIcon}/>
            Quizzes
          </NavLink>
          
          <NavLink to='/leaderboard' className={navbarStyles.resultsButton}>
            <Trophy className={navbarStyles.buttonIcon}/>
            Leaderboard
          </NavLink>
          
          {loggedIn && (
            <NavLink to='/create-quiz' className={navbarStyles.resultsButton}>
              <Plus className={navbarStyles.buttonIcon}/>
              Create Quiz
            </NavLink>
          )}
          
          <NavLink to = '/result' className={navbarStyles.resultsButton}>
          <Award className={navbarStyles.buttonIcon}/>
            My Result
          </NavLink>

          {loggedIn ? (
             <button
             onClick={handleLogout}
             className={navbarStyles.logoutButton}
             >

              <LogOut className={navbarStyles.buttonIcon}/>
              Logout
             </button>
          ):(
            <NavLink to = '/login' className={navbarStyles.loginButton}>
              <LogIn className={navbarStyles.buttonIcon} />
              Login
            </NavLink>
          )}
        </div>
        <div className={navbarStyles.mobileMenuContainer}>
          <button
          onClick={() => setMenuOpen((s) => !s)}
          className={navbarStyles.menuToggleButton}
          >
            {menuOpen ? (
              <X className={navbarStyles.menuIcon} />
            ):(
              <Menu className={navbarStyles.menuIcon} />
            )}
          </button>

          {menuOpen && (
            <div className={navbarStyles.mobileMenuPanel}>
              <ul className={navbarStyles.mobileMenuList}>
                <li>
                  <NavLink
                  to = '/quizzes'
                  className={navbarStyles.mobileMenuItem}
                  onClick={() => setMenuOpen(false)}
                  >
                    <BookOpen className={navbarStyles.mobileMenuIcon} />
                    Quizzes 
                  </NavLink>
                </li>
                
                {loggedIn && (
                  <li>
                    <NavLink
                    to = '/create-quiz'
                    className={navbarStyles.mobileMenuItem}
                    onClick={() => setMenuOpen(false)}
                    >
                      <Plus className={navbarStyles.mobileMenuIcon} />
                      Create Quiz 
                    </NavLink>
                  </li>
                )}
                
                <li>
                  <NavLink
                  to = '/result'
                  className={navbarStyles.mobileMenuItem}
                  onClick={() => setMenuOpen(false)}
                  >
                    <Award className={navbarStyles.mobileMenuIcon} />
                    My Result 
                  </NavLink>
                  </li>
                
                {loggedIn ?(
                  <li>
                    <button type='button' onClick={handleLogout} className={navbarStyles.mobileMenuItem}>
                      Logout
                    </button>
                  </li>
                ):
                <li>
                  <NavLink to='/login' className={navbarStyles.mobileMenuItem} onClick={()=> setMenuOpen(false)}
                  >
                  <LogIn className={navbarStyles.mobileMenuIcon}
                  />
                  Login
                  </NavLink>
                  </li>}
              </ul>
            </div>
          )}
        </div>
        </div>

        <style> {navbarStyles.animations}</style>
    </nav>
  );
};

export default Navbar;
