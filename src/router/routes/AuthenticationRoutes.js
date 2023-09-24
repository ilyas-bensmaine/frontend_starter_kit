import { lazy } from "react";

const Login = lazy(() => import("../../views/authentication/Login"));
const Register = lazy(() => import("../../views/authentication/Register"));
const ForgotPassword = lazy(() => import("../../views/authentication/ForgotPassword"));

const AuthenticationRoutes = [
    {
        path: "/login",
        element: <Login />,
        meta: {
          layout: "blank",
          publicRoute: true,
        },
      },
      {
        path: "/register",
        element: <Register />,
        meta: {
          layout: "blank",
          publicRoute: true,
        },
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
        meta: {
          layout: "blank",
          publicRoute: true,
        },
      },    
]

export default AuthenticationRoutes
