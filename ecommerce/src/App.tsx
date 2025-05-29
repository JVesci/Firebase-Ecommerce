import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { Provider } from "react-redux";

import { auth } from "./firebaseConfig";
import store from "./redux/store";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CartPage from "./pages/Cart";
import NavBar from "./components/NavBar";
import AuthForm from "./components/AuthForm";
import Products from './pages/Products';
import OrderHistory from './pages/OrderHistory';
import Checkout from './pages/Checkout';

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <AuthForm />
      </div>
    );
  }

  return (
    <Provider store={store}>
      <div className="min-vh-100">
        <NavBar user={user} />
        <div className="container py-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/checkout"
              element={
                <Checkout
                  cart={store.getState().cart.items}
                  clearCart={() => store.dispatch({ type: "cart/clearCart" })}
                />
              }
            />
            <Route path="/orders" element={<OrderHistory />} />
          </Routes>
        </div>
      </div>
    </Provider>
  );
};

export default App;