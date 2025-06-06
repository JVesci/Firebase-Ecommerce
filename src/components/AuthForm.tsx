import { useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { createUserDocument } from '../services/firebaseUserService';

const AuthForm = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setError('');
            setEmail('');
            setPassword('');
            setIsRegistering(false);
        });
        return () => unsubscribe();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Create Firestore user document right after registration
            await createUserDocument(userCredential.user.uid, {
                email: userCredential.user.email,
                createdAt: new Date(),
                // You can add other default fields here (name, address)
            });
            alert('Registration successful!');
        } catch (err: any) {
            setError(err.message || 'Failed to register');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message || 'Failed to log in');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    if (user) {
        return (
            <div className="text-center mt-5">
                <h2>Welcome, {user.email}</h2>
                <button className="btn btn-secondary mt-3" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
            <h1 className="mb-4">Fake Store</h1>
            <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
                {isRegistering ? (
                    <form onSubmit={handleRegister}>
                        <h3 className="mb-3 text-center">Register</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <label htmlFor="registerEmail" className="form-label">
                                Email address
                            </label>
                            <input
                                id="registerEmail"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="registerPassword" className="form-label">
                                Password
                            </label>
                            <input
                                id="registerPassword"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Register
                        </button>
                        <p className="mt-3 text-center">
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={() => {
                                    setIsRegistering(false);
                                    setError('');
                                }}
                            >
                                Login
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleLogin}>
                        <h3 className="mb-3 text-center">Login</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <label htmlFor="loginEmail" className="form-label">
                                Email address
                            </label>
                            <input
                                id="loginEmail"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="loginPassword" className="form-label">
                                Password
                            </label>
                            <input
                                id="loginPassword"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Login
                        </button>
                        <p className="mt-3 text-center">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={() => {
                                    setIsRegistering(true);
                                    setError('');
                                }}
                            >
                                Register
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthForm;