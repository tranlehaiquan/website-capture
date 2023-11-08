
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import CaptureInput from "../components/CaptureInput";
import { API } from "aws-amplify";


export default function Home() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    const rs = await API.post("capture", "/capture", {
      body: data,
    });

    if (rs?.id) {
      navigate(`/capture/${rs.id}`);
    }
  };

  return (
    <Layout>
      <main className="h-screen py-2 bg-[#fafbfb]">
        <div className="container mx-auto">
          <div className="text-center my-10">
            <p className="text-2xl">Take a screenshot website online</p>
            <p className="text-xl">
              An easy way to capture a screenshot of a full webpage
            </p>
          </div>
          <div className="flex items-start mt-6 w-1/2 mx-auto">
            <div className="w-full">
              <CaptureInput onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
