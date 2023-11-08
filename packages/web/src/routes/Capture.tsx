import React, { useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import Layout from "../components/Layout";

interface Props {
  className?: string;
}

type Capture = {
  createdAt: string;
  updatedAt: string;
  id: string;
  website: string;
  imagePath: string;
  status: string;
  preSignedUrl: string;
};

const Web: React.FC<Props> = () => {
  const data = useLoaderData();
  const capture = data as Capture;
  const revalidator = useRevalidator();
  const timer = React.useRef<number | null>(null);

  useEffect(() => {
    if (capture.status === "inProcess") {
      // set timer
      timer.current = window.setInterval(() => {
        revalidator.revalidate();
      }, 5000);
    }

    return () => {
      if (timer.current) {
        window.clearInterval(timer.current);
      }
    };
  }, []);

  return (
    <Layout>
      <div className="container">
        <p className="text-center my-4">Screenshot details</p>
        <p>URL: {capture.website}</p>
        <p>Created on: {new Date(capture.createdAt).toString()}</p>

        {capture.status === "inProcess" && (
          <div>...loading auto update every 10s</div>
        )}

        {capture.status === "successful" && (
          <div className="flex justify-center items-center py-4">
            <img
              src={capture.preSignedUrl}
              alt={"capture website"}
              className="shadow-2xl max-w-full"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Web;
