import React, { useState, useEffect,useRef } from 'react';
import { 
  Home, 
  Briefcase, 
  User, 
  Menu,   
  X, 
  LogIn, 
  UserPlus, 
  LogOutIcon,
  ChevronDown
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { loginAction, logoutAction } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import summaryApi from '../common';

const LoginRegisterModal = ({ isOpen, onClose, type, setModalType, setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      fullName: '',
      email: '',
      password: ''
    });
  }, [type]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = type === 'login' 
        ? summaryApi.login.url
        : summaryApi.register.url;

      const res = await fetch(endpoint, {
        credentials: "include",
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(type === 'login' 
          ? { email: formData.email, password: formData.password }
          : formData
        )
      });

      if (!res.ok) {
        throw new Error("Authentication failed");
      }

      const dataApi = await res.json();
      dispatch(loginAction(dataApi));
      setIsAuthenticated(true);
      onClose();
      navigate('/');
    } catch (error) {
      console.error(error);
     
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500">
            {type === 'login' 
              ? 'Log in to access your personalized job dashboard' 
              : 'Join our professional community today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <input 
              type="text" 
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          )}
          <input 
            type="email" 
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input 
            type="password" 
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            {type === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            {type === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <button 
              onClick={() => setModalType(type === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:underline"
            >
              {type === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profileDropdownRef = useRef(null);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home />, label: 'Home', path: '/' },
    { icon: <Briefcase />, label: 'Jobs', path: '/jobs' },
  ];

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (modalType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalType]);

  const handleLogout = async () => {
    try {
      await fetch(summaryApi.logout.url, {
        credentials: "include",
        method: summaryApi.logout.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      dispatch(logoutAction());
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        profileDropdownRef.current && 
        !profileDropdownRef.current.contains(e.target)
      ) {
        setIsProfileDropdownOpen(false); // Close dropdown if clicking outside
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isProfileDropdownOpen]);

  const ProfileDropdown = () => (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="px-4 py-3 border-b">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-medium text-gray-800 truncate">{user?.fullName || user?.email}</p>
      </div>
      <div className="py-1">
        <Link 
          to="/me" 
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <User className="mr-3" size={18} />
          My Profile
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          <LogOutIcon className="mr-3" size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="text-blue-600" size={32} />
            <span className="text-2xl font-bold text-blue-600">JobPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.label}
                to={item.path}
                className="text-gray-700 hover:text-blue-600 transition flex items-center space-x-2 group"
              >
                {React.cloneElement(item.icon, {
                  className: 'text-gray-500 group-hover:text-blue-600 transition'
                })}
                <span>{item.label}</span>
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link 
              key='Admin'
              to="/admin"
              className="text-gray-700 hover:text-blue-600 transition flex items-center space-x-2 group"
            >
              {React.cloneElement(<User />, {
                className: 'text-gray-500 group-hover:text-blue-600 transition'
              })}
              <span>Admin</span>
            </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                    {user?.name ? user.name[0].toUpperCase() : <User size={18} />}
                  </div>
                  {user?.name.split(" ")[0]}
                  <ChevronDown size={18} className="text-gray-500" />
                </button>
                {isProfileDropdownOpen && <ProfileDropdown />}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setModalType('login')}
                  className="text-gray-700 hover:text-blue-600 transition flex items-center space-x-2"
                >
                  <LogIn className="mr-2" size={18} /> Login
                </button>
                <button 
                  onClick={() => setModalType('register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <UserPlus className="mr-2 inline-block" size={18} /> Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {menuItems.map((item) => (
                <Link 
                  key={item.label}
                  to={item.path}
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              {!user && (
                <div className="space-y-3 pt-4 border-t">
                  <button 
                    onClick={() => setModalType('login')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    <LogIn className="mr-2 inline-block" /> Login
                  </button>
                  <button 
                    onClick={() => setModalType('register')}
                    className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition"
                  >
                    <UserPlus className="mr-2 inline-block" /> Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Authentication Modal */}
      <LoginRegisterModal 
        isOpen={!!modalType} 
        onClose={() => setModalType(null)}
        type={modalType}
        setIsAuthenticated={setIsAuthenticated}
        setModalType={setModalType}
      />
    </>
  );
};

export default Header;