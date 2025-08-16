import { SignIn } from "@clerk/clerk-react";

const Signin = () => {
  return (
    <header className="flex justify-center items-center align-middle mt-30">
      <SignIn />
    </header>
  );
};

export default Signin;
