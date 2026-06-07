import { createBrowserRouter } from "react-router-dom"
import App from "./App";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
    {path: "/", element: <App />},
    {path: "/signup", element: <Signup />},
    {path: "/signin", element: <Signin />},
    {path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute>},
    {path: "/chat/:documentId", element: <ProtectedRoute><Chat /></ProtectedRoute>}
]);