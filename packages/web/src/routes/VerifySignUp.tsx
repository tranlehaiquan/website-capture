import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../components/Layout";
import TextInput from "../components/TextInput";
import { Auth } from "aws-amplify";
import { toast } from "react-toastify";

interface Props {
  className?: string;
}

const schema = yup.object().shape({
  code: yup.string().required(),
});

const VerifySignUp: React.FC<Props> = () => {
  // use params
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      code: "",
    },
    resolver: yupResolver(schema),
  });
  const email = searchParams.get("email");

  const onSubmit = handleSubmit(async (data) => {
    try {
      await Auth.confirmSignUp(email!, data.code);
      toast.success("Account created successfully");
      nav("/signIn");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  });

  return (
    <Layout>
      <div className="container pt-4">
        {email}
        <div className="max-w-md mx-auto">
          <label className="block mb-2">
            <TextInput label="Code" placeholder="Code" {...register("code")} />
          </label>
          {formState.errors.code && (
            <p className="text-red-600">{formState.errors.code.message}</p>
          )}

          <button
            className="btn w-full"
            disabled={formState.isSubmitting}
            onClick={onSubmit}
          >
            Verify
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default VerifySignUp;
