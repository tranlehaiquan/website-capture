import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  uri: yup.string().url("URL must be validate").required("URL can't be empty"),
});

export default function Root() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (data: any) => {
    const rs = await fetch(`${import.meta.env.VITE_APP_API_URL}/capture`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await rs.json();
    if(result?.id) {
      navigate(`/web/${result.id}`);
    }
  };

  return (
    <div className="container h-screen w-screen">
      <div className="flex items-start mt-6 w-1/2 mx-auto">
        <div className="w-full">
          <input
            className="p-2 border-2 border-gray-200 rounded block w-full"
            {...form.register("uri")}
            placeholder="Enter website URL"
          />
          {form.formState.errors.uri && (
            <span className="text-red-500 text-sm">
              {form.formState.errors.uri.message}
            </span>
          )}
        </div>

        {/* button submit */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={form.handleSubmit(handleSubmit)}
        >
          Capture
        </button>
      </div>
    </div>
  );
}
