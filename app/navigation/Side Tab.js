import HomeStack from "./HomeStack";
import ContactUs from "../screens/main/ContactUs";
import SidebarTabView from "../custom/SidebarTabView";
import LocalProductsStack from "./LocalProductsStack";
import WhereToGoStack from './WhereToGoStack';
import WhereToStayStack from "./WhereToStayStack";
import LoginScreen from "../screens/auth/LoginScreen";

const SideTab = () => {
  const tabs = [
    { key: "Home", 
      title: "Home", 
      component:HomeStack, 
    },
    {
      key: "WhereToGo",
      title: "Explore",
      component:WhereToGoStack,
    },
    {
      key: "whereToStay",
      title: "Stays",
      component:WhereToStayStack,
    },
    {
      key: "localProducts",
      title: "Products",
      component: LocalProductsStack,
    },
    { key: "contactUs", title: "Contact", component: ContactUs },
    { key: "login", title: "Login", component: LoginScreen },
  ];

  return <SidebarTabView tabs={tabs} />;
};

export default SideTab;
