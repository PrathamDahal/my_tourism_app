import HomeStack from "./HomeStack";
import ContactUs from "../screens/main/ContactUs";
import SidebarTabView from "../custom/SidebarTabView";
import LocalProductsStack from "./LocalProductsStack";
import WhereToGoStack from "./WhereToGoStack";
import WhereToStayStack from "./WhereToStayStack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/register/SignUp";
import React from "react";

const SideTab = ({route}) => {
  const [ setActiveTabKey ] = React.useState("Home");
  const initialTab = route.params?.initialTab || "Home";

  const tabs = [
    { key: "Home", title: "Home", component: HomeStack },
    {
      key: "whereToGo",
      title: "Explore",
      component: WhereToGoStack,
    },
    {
      key: "whereToStay",
      title: "Stays",
      component: WhereToStayStack,
    },
    {
      key: "localProducts",
      title: "Products",
      component: LocalProductsStack,
    },
    { key: "contactUs", title: "Contact", component: ContactUs },
    { key: "login", title: "Login", component: LoginScreen },
    { key: "signUp", title: "SignUp", component: RegisterScreen },
  ];

  return (
    <SidebarTabView
      tabs={tabs}
      activeTabKey={initialTab}
    />
  );
};

export default SideTab;
