import Users from "./Users"
import { Home } from "react-feather"

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    action: 'list',
    resource: 'home',
    navLink: "/home"
  },
  ...Users
]
