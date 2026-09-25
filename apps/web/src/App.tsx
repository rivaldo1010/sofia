import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderSuccess } from "./pages/OrderSuccess";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Favorites } from "./pages/Favorites";
import { MyOrders } from "./pages/MyOrders";
import { MyAccount } from "./pages/MyAccount";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { useAuth } from "./store/auth";
import { useFavorites } from "./store/favorites";
import { useConfig } from "./store/config";
import { useTheme } from "./store/theme";
import { Products } from "./pages/admin/Products";
import { Categories } from "./pages/admin/Categories";
import { Orders } from "./pages/admin/Orders";
import { Inventory } from "./pages/admin/Inventory";
import { Customers } from "./pages/admin/Customers";
import { Settings } from "./pages/admin/Settings";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  const check = useAuth((s) => s.check);
  const loadFavs = useFavorites((s) => s.load);
  const loadConfig = useConfig((s) => s.load);
  const initTheme = useTheme((s) => s.init);
  
  useEffect(() => {
    initTheme();
    check().then(() => loadFavs());
    loadConfig();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
      <Route path="/hombre" element={<StoreLayout><Catalog gender="HOMBRE" /></StoreLayout>} />
      <Route path="/mujer" element={<StoreLayout><Catalog gender="MUJER" /></StoreLayout>} />
      <Route path="/producto/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
      <Route path="/carrito" element={<StoreLayout><Cart /></StoreLayout>} />
      <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
      <Route path="/pedido/:id" element={<StoreLayout><OrderSuccess /></StoreLayout>} />
      <Route path="/favoritos" element={<StoreLayout><Favorites /></StoreLayout>} />
      <Route path="/mis-pedidos" element={<StoreLayout><MyOrders /></StoreLayout>} />
      <Route path="/mi-cuenta" element={<StoreLayout><MyAccount /></StoreLayout>} />
      <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
      <Route path="/registro" element={<StoreLayout><Register /></StoreLayout>} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Products />} />
        <Route path="categorias" element={<Categories />} />
        <Route path="pedidos" element={<Orders />} />
        <Route path="clientes" element={<Customers />} />
        <Route path="inventario" element={<Inventory />} />
        <Route path="configuracion" element={<Settings />} />
      </Route>
    </Routes>
  );
}