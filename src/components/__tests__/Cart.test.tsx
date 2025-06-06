import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../../redux/store";
import Cart from "../Cart";
import ProductList from "../ProductList";

// Mock fetchProducts to return some fake products immediately
jest.mock("../../services/firebaseProductService", () => ({
    fetchProducts: jest.fn(() => Promise.resolve([
        {
            id: "1",
            title: "Test Product",
            description: "A product for testing",
            price: 10,
            quantity: 5,
            category: "Test Category",
            image: undefined,
        }
    ])),
}));

test("adds a product and updates cart UI", async () => {
    render(
        <Provider store={store}>
            <>
                <ProductList />
                <Cart />
            </>
        </Provider>
    );

    // Wait for "Add to Cart" button to appear
    const addToCartButtons = await screen.findAllByRole("button", { name: /add to cart/i });
    expect(addToCartButtons.length).toBeGreaterThan(0);

    // Click the first "Add to Cart" button
    await userEvent.click(addToCartButtons[0]);

    // The empty cart message should disappear
    expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();

    // Product should appear in cart with qty 1 (adjust this based on your Cart implementation)
    expect(screen.getByText(/qty: 1/i)).toBeInTheDocument();
});