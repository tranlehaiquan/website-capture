import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { login } from "../store/auth/authSlice";
import { RootState } from "../store/store";

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
  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state: RootState) => state.authReducer.userInfo
  );
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
    dispatch(login(data) as any);
  });

  // redirect authenticated user to profile screen
  useEffect(() => {
    if (userInfo) {
      nav("/");
    }
  }, [userInfo]);

  return (
    <Layout>
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
    </Layout>
  );
};

export default SignIn;
