import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import { setIsAuthenticated, setUserInfo } from "../store/auth/authSlice";
import { RootState, useDispatch } from "../store/store";
import TextInput from "../components/TextInput";
import { Auth } from "aws-amplify";
import { toast } from "react-toastify";

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
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  const nav = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await Auth.signIn(data.email, data.password);
      const userInfo = await Auth.currentUserInfo();

      dispatch(setUserInfo(userInfo));
      dispatch(setIsAuthenticated(true));
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  });

  // redirect authenticated user to profile screen
  useEffect(() => {
    if (userInfo) {
      nav("/");
    }
  }, [userInfo, nav]);

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="pt-20 max-w-md mx-auto">
          <label className="mb-3 block">
            <TextInput
              label="Email"
              placeholder="Email"
              {...register("email")}
            />
            {/* error */}
            {formState.errors.email && (
              <p className="text-red-600">{formState.errors.email.message}</p>
            )}
          </label>
          <label className="block mb-2">
            <TextInput
              label="Password"
              placeholder="Your password"
              type="password"
              {...register("password")}
            />
            {formState.errors.password && (
              <p className="text-red-600">
                {formState.errors.password.message}
              </p>
            )}
          </label>
          <button
            disabled={formState.isSubmitting}
            onClick={onSubmit}
            className="btn w-full"
          >
            Sign In
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
