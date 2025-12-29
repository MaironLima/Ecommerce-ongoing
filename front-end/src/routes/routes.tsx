import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import App from "../App";
import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import RecoverPage from "@/components/RecoverPage";
import Buttons from "@/components/Buttons";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
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
        path: "recover-password",
        element: <RecoverPage />,
      },
    ],
  },
]);

export default router;

//   {
//     path: "/",
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//       path: "teste",
//       element: <Teste />
//       },
//       {
//       path: "teste2",
//       element: <Teste2 />
//       },
//       {
//         path: "/teste2/:id",
//         element: <TesteId />
//       },
//       {
//         path: "old",
//         element: <Navigate to="/teste" />
//       }
//     ]
//   },

// ])
