import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getCapture } from "../api-services";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";

interface Props {
  className?: string;
}

const Web: React.FC<Props> = () => {
  const { id } = useParams();
  const timer = React.useRef<any>(null);

  const queryCapture = useQuery({
    queryKey: ["capture", id],
    queryFn: () => getCapture(id as string, true),
  });

  useEffect(() => {
    if (queryCapture?.data?.status === "inProcess") {
      timer.current = setInterval(() => {
        queryCapture.refetch();
      }, 10000);
      return () => clearInterval(timer.current);
    }
  }, [queryCapture]);

  if (queryCapture.isLoading) {
    return (
      <Layout>
        <div className="container">
          <div className="text-center my-4">
            <Spinner />
          </div>
        </div>
      </Layout>
    );
  }

  const { data: capture } = queryCapture;

  return (
    <Layout>
      <div className="container">
        <p className="text-center my-4">Screenshot details</p>
        <p>URL: {capture?.website}</p>
        <p>Created on: {new Date(capture?.createdAt || "").toString()}</p>

        {capture?.status === "inProcess" && (
          <div>
            <Spinner />
            <span>...loading auto update every 10s</span>
          </div>
        )}

        {capture?.status === "successful" && (
          <div className="flex justify-center items-center py-4">
            <img
              src={capture?.preSignedUrl}
              alt={"capture website"}
              className="shadow-2xl max-w-full"
              width={capture?.width}
              height={capture?.height}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Web;
