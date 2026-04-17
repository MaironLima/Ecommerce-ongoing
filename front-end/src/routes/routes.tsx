import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Buttons from "@/components/Buttons";
import ErrorPage from "@/pages/ErrorPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RecoverPage from "@/pages/RecoverPage";
import MainPage from "@/pages/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/m",
        element: <Buttons />,
      },
      {
        path: "",
        element: <MainPage />
      }
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
]);

export default router;
