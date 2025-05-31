// Mock firebaseConfig to avoid calling real getAuth during tests
jest.mock('../../firebaseConfig', () => ({
    auth: {}, // just provide an empty object for auth
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../NavBar';

// Mock Link from react-router-dom since NavBar uses it
jest.mock('react-router-dom', () => ({
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to}>{children}</a>
    ),
}));

// Mock redux hooks to control cart state
jest.mock('../../redux/hooks', () => ({
    useAppSelector: jest.fn(() => [{ quantity: 2 }, { quantity: 3 }]), // cart with 2+3=5 items
}));

// Mock Firebase auth signOut
jest.mock('firebase/auth', () => ({
    signOut: jest.fn().mockResolvedValue(undefined),
}));

describe('NavBar', () => {
    it('renders welcome message when no user', () => {
        render(<NavBar user={null} />);
        expect(screen.getByText('Welcome')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('renders welcome message with user email and cart count', () => {
        const user = { email: 'test@example.com' };
        render(<NavBar user={user as any} />);
        expect(screen.getByText(`Welcome, ${user.email}`)).toBeInTheDocument();
        expect(screen.getByText('Cart (5)')).toBeInTheDocument(); // cart count from mocked selector
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('calls signOut when logout button is clicked', async () => {
        const { signOut } = require('firebase/auth');
        const user = { email: 'test@example.com' };
        render(<NavBar user={user as any} />);
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);
        expect(signOut).toHaveBeenCalled();
    });
});