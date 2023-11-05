import React, { useState } from "react";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import auth from "../signals/auth";

interface Props {
  className?: string;
}

// type
type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const SignIn: React.FC<Props> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  const nav = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const user = await Auth.signIn(data.email, data.password);
      console.log(user);
      auth.value.isAuthenticated = true;
      nav("/");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
      setIsLoading(false);
    }
  });

  return (
    <div className="container mx-auto">
      <div className="mt-20 max-w-md mx-auto">
        <label className="mb-3 block">
          Email:
          <input {...register("email")} />
          {/* error */}
          {formState.errors.email && (
            <p className="error">{formState.errors.email.message}</p>
          )}
        </label>
        <label className="block mb-2">
          Password:
          <input {...register("password")} type="password" />
          {/* error */}
          {formState.errors.password && (
            <p className="error">{formState.errors.password.message}</p>
          )}
        </label>

        <button disabled={isLoading} onClick={onSubmit}>
          Login
        </button>
      </div>
    </div>
  );
};

export default SignIn;
