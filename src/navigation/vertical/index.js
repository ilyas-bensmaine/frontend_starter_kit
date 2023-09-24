import { Mail, Home } from "react-feather";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    action: 'list',
    resource: 'home',
    navLink: "/home",
  },
  {
    id: "secondPage",
    title: "Second Page",
    icon: <Mail size={20} />,
    action: 'list',
    resource: 'secondPage',
    navLink: "/second-page",
  },
];
