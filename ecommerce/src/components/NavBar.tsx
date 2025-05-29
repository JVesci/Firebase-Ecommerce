import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface NavBarProps {
    user: User | null;
}

const NavBar = ({ user }: NavBarProps) => {
    const cart = useAppSelector((state) => state.cart.items);
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Camping Gear</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item px-2">
                            <span className="navbar-text">
                                {user ? `Welcome, ${user.email}` : "Welcome"}
                            </span>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">Products</Link>
                        </li>
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">Orders</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">Cart ({cartCount || 0})</Link>
                                </li>
                                <li className="nav-item">
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-outline-dark btn-sm ms-lg-2 mt-2 mt-lg-0"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                        {!user && (
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary btn-sm ms-lg-3 mt-2 mt-lg-0" to="/auth">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;