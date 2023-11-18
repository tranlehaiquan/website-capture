import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../components/Layout";
import TextInput from "../components/TextInput";
import { signUp } from "aws-amplify/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  className?: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

// type
type FormData = {
  email: string;
  password: string;
};

const SignUp: React.FC<Props> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await signUp({
        username: data.email,
        password: data.password,
      });

      const params = new URLSearchParams();
      params.append("email", data.email);

      nav(`/verify-signUp?${params.toString()}`);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  });

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
            disabled={isLoading}
            onClick={onSubmit}
            className="btn w-full"
          >
            Sign Up
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
