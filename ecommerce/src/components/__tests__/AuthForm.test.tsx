import { render, screen, fireEvent, act } from '@testing-library/react';
import AuthForm from '../AuthForm';

describe('AuthForm', () => {
    it('shows login form initially', async () => {
        await act(async () => {
            render(<AuthForm />);
        });

        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('switches to registration form when clicking register', async () => {
        await act(async () => {
            render(<AuthForm />);
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /register/i }));
        });

        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });
});