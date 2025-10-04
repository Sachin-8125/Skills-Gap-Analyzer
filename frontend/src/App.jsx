import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';

// Main App Component
const App = () => {
    const [user, setUser] = useState(null); // Logged in user object
    const [view, setView] = useState('login'); // 'login' or 'signup'

    // This effect will check local storage for a user session
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setView('login');
    };

    if (!user) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans">
                {view === 'login' && <AuthForm isLogin={true} setView={setView} onAuthSuccess={handleLogin} />}
                {view === 'signup' && <AuthForm isLogin={false} setView={setView} onAuthSuccess={handleLogin} />}
            </div>
        );
    }

    return <Dashboard user={user} onLogout={handleLogout} />;
};

export default App;
