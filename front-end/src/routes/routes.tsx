import { createBrowserRouter } from "react-router-dom"
import ErrorPage from "../components/ErrorPage"
import App from "../App"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      
    ]
  },
  
])

export default router


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