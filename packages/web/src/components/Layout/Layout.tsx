import React from "react";
import Header from "../Header";
import Footer from "../Footer";

interface Props {
  className?: string;
}

const Layout: React.FC<React.PropsWithChildren<Props>> = (props) => {
  return (
    <div>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
