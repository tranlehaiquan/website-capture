import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Layout from "../components/Layout";
import CaptureInput from "../components/CaptureInput";
import { createCapture } from "../api-services";
import Spinner from "../components/Spinner";

export default function Home() {
  const navigate = useNavigate();
  // Mutations
  const mutation = useMutation({
    mutationFn: createCapture,
    onSuccess: (data) => {
      if (data?.id) {
        navigate(`/capture/${data.id}`);
      }
    },
  });

  const handleSubmit = async (data: any) => {
    await mutation.mutateAsync(data);
  };

  return (
    <Layout>
      <main className="h-screen py-2">
        <div className="container mx-auto">
          <div className="text-center my-10">
            <p className="text-2xl">Take a screenshot website online</p>
            <p className="text-xl">
              An easy way to capture a screenshot of a full webpage
            </p>
          </div>
          <div className="mt-6 w-1/2 mx-auto">
            <div className="w-full">
              <CaptureInput onSubmit={handleSubmit} />
            </div>

            {mutation.isPending && (
              <div className="ml-4 py-10">
                <Spinner className="w-full" />
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
