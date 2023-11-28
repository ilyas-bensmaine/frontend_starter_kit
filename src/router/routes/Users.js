import { lazy } from "react";

const UsersList = lazy(() => import("../../views/users/List"));
const UserAccount = lazy(() => import("../../views/users/account"));

const UsersRoutes = [
  {
    path: "/users",
    element: <UsersList />,
    meta: {
      action: "list",
      resource: "home",
    },
  },
  {
    path: "/users/:id/account",
    element: <UserAccount />,
    meta: {
      action: "list",
      resource: "home",
    },
  },
];

export default UsersRoutes;
