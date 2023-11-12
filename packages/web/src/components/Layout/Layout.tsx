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
      <div className="min-h-[calc(100vh-100px)]">{props.children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
