import HomeStack from "./HomeStack";
import ContactUs from "../screens/main/ContactUs";
import Login from "../screens/auth/Login";
import SidebarTabView from "../custom/SidebarTabView";
import LocalProductsStack from "./ProductsStack";
import WhereToGoStack from './WhereToGoStack';
import WhereToStayStack from "./WhereToStayStack";

// Helper function to wrap navigators in a Screen-like component
const wrapStack = (StackComponent) => {
  return () => <StackComponent />;
};

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
    { key: "login", title: "Login", component: Login },
  ];

  return <SidebarTabView tabs={tabs} />;
};

export default SideTab;
