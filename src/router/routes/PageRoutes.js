import { lazy } from "react";
import { Navigate } from "react-router-dom";

// ** Default Route
const DefaultRoute = "/home";

const Home = lazy(() => import("../../views/Home"));
const SecondPage = lazy(() => import("../../views/SecondPage"));
const Error = lazy(() => import("../../views/pages/Error"));
const NotAuthorized = lazy(() => import("../../views/pages/NotAuthorized"));


const PageRoutes = [
    {
        path: "/",
        index: true,
        element: <Navigate replace to={DefaultRoute} />,
      },
      {
        path: "/home",
        element: <Home />,
        meta: {
            action: 'list',
            resource: 'home'
        }
      },
      {
        path: "/second-page",
        element: <SecondPage />,
        meta: {
            action: 'list',
            resource: 'secondPage'
        }
      },
      {
        path: "/error",
        element: <Error />,
        meta: {
            publicRoute: true,
            layout: "blank",
        },
      },
      {
        path: "/not-authorized",
        element: <NotAuthorized />,
        meta: {
            publicRoute: true,
            layout: "blank",
        },
      },
]

export default PageRoutes
