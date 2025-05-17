import { Link } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'

const NavBar = () => {
    const cart = useAppSelector(state => state.cart.items)
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0)

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <Link className="navbar-brand" to="/">Fake Store</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">
                                Cart ({cartCount || 0})
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar