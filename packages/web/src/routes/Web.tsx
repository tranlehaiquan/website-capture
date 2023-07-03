import React, { useEffect } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";

interface Props {
  className?: string;
}

type Capture = {
  createdAt: string;
  updatedAt: string;
  id: string;
  websiteId: string;
  imagePath: string;
  status: string;
  preSignedUrl: string;
};

const Web: React.FC<Props> = () => {
  const data = useLoaderData();
  const { capture } = data as { capture: Capture };
  const revalidator = useRevalidator();
  // ref timer
  const timer = React.useRef<number | null>(null);

  useEffect(() => {
    if(capture.status !== "successful") {
    // set timer
    timer.current = window.setInterval(() => {
      revalidator.revalidate();
    }, 10000);
    }

    return () => {
      if(timer.current) {
        window.clearInterval(timer.current);
      }
    }
  }, []);


  return (
    <div className="container">
      {/* back to home */}
      <Link to={"/"} className="text-blue-500 hover:text-blue-800">
        Back to Home
      </Link>

      {/* status */}
      <h1 className="text-2xl">Status: {capture.status}</h1>
      {/* time create */}
      <h2>Created at: {new Date(capture.createdAt).toLocaleDateString()}</h2>
      {/* image path */}
      
      {capture.status === "inProcess" && (
        <div>
          ...loading auto update every 10s
        </div>
      )}

      {capture.status === "successful" && (
        <div className="flex justify-center items-center">
          <img
            src={capture.preSignedUrl}
            alt={"capture website"}
            className="w-2/3"
          />
        </div>
      )}
    </div>
  );
};

export default Web;
