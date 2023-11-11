import React from "react";
import Layout from "../components/Layout";

interface Props {
  className?: string;
}

const SignUp: React.FC<Props> = () => {
  return (
    <Layout>
      <div className="container">
        <p>Sign Up</p>
        <p>Coming soon...</p>
      </div>
    </Layout>
  );
};

export default SignUp;
