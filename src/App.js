import ActivateAccount from "./pages/activateAccount";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// 
import Contact from './pages/Contact';
import SupportMessages from './pages/admin/SupportMessages';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

import HomePage from "./pages/index";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ProfilePage from "./pages/profile";
import ProductDetails from "./pages/product/[id]";
import CategoryProducts from "./pages/product/CategoryProducts";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import OrdersPage from "./pages/orders";
import WishlistPage from "./pages/wishlist";
import ProductsPage from "./pages/products";
import CollectionsPage from "./pages/collections";

import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/products";
import AdminDeals from "./pages/admin/deals";
import DiscountCarouselAdmin from "./pages/admin/DiscountCarouselAdmin";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/orders";
import AdminCustomers from "./pages/admin/customers";
import AdminReturns from "./pages/admin/returns";
import OrderDetails from './pages/admin/OrderDetails';
import DiscountsAdmin from "./pages/admin/DiscountsAdmin";

// 📌 Footer pages
import HelpCenter from "./pages/Contact";
import Returns from "./pages/returns";
import ChangePassword from "./pages/changePassword";
import ResetPassword from "./pages/resetPassword";
// import ActivateAccount from "./pages/admin/activateAccount";
import Shipping from "./pages/shipping";
import FAQs from "./pages/FAQs";
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/About-us";
import Careers from "./pages/careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/privacy";
import ManwellGlobal from "./pages/Global";
import ManwellPay from "./pages/manderapay";
import ManwellFood from "./pages/manderafood";
import ManwellTravel from "./pages/ManderifyTravel";





// ✅ PrivateRoute for v6
const PrivateRoute = ({ children, roles }) => {
  const { user } = React.useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <main className="app-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:category" element={<CategoryProducts />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/activate-account" element={<ActivateAccount />} />
            <Route path="/admin/discounts" element={<DiscountsAdmin />} />

            {/* Footer routes */}
            <Route path="/Contact" element={<HelpCenter />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/manwell-global" element={<ManwellGlobal />} />
            <Route path="/manwell-pay" element={<ManwellPay />} />
            <Route path="/manwell-food" element={<ManwellFood />} />
            <Route path="/manwell-travel" element={<ManwellTravel />} />
            {/*  */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/support" element={<SupportMessages />} />

           
            {/* other routes */}
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          
            


            {/* Protected routes */}
            <Route
              path="/admin/orders/:orderId"
              element={
                <PrivateRoute roles={["admin"]}>
                  <OrderDetails />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/discount-carousel"
              element={
                <PrivateRoute roles={["admin"]}>
                  <DiscountCarouselAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/add-product"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AddProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/product/addproduct"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AddProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminCustomers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/returns"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminReturns />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/deals"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminDeals />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/activate-account"
              element={
                <PrivateRoute roles={["admin"]}>
                  <ActivateAccount />
                </PrivateRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<h2>404 - Not Found</h2>} />
          </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
