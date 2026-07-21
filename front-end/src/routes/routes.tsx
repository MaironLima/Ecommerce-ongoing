import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Buttons from "@/components/Buttons";
import ErrorPage from "@/pages/ErrorPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RecoverPage from "@/pages/RecoverPage";
import MainPage from "@/pages/MainPage";
import ProductPage from "@/pages/ProductPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <MainPage />
      },
      {
        path: "/m",
        element: <Buttons />,
      },
    ],
  },
  {
    path: "/auth",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "recover",
        element: <RecoverPage />,
      },
    ],
  },
  {
    path: "/product",
    errorElement: <ErrorPage />,
    children: [
      {
        path: ":id",
        element: <ProductPage />,
      }
    ],
  },
]);

export default router;
