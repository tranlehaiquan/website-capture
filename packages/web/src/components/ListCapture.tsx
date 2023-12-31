


import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { getCaptureList } from "../api-services";
import Spinner from "../components/Spinner";

interface Props {
  className?: string;
}

const ListCapture: React.FC<Props> = () => {
  const queryCaptureList = useQuery({
    queryKey: ["listCapture"],
    queryFn: () => getCaptureList(),
  });

  if (queryCaptureList.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th>Id</th>
          <th>Date</th>
          <th>Website</th>
          <th>Status</th>
          <th>Width x Height</th>
          <th>Type Image</th>
          <th>Recurring</th>
        </tr>
      </thead>
      <tbody>
        {queryCaptureList.data?.map((capture) => (
          <tr key={capture.id}>
            <td>
              <Link to={`/capture/${capture.id}`} className="text-blue-500">
                {capture.id}
              </Link>
            </td>
            <td>{new Date(capture.createdAt).toString()}</td>
            <td>{capture.website}</td>
            <td>{capture.status}</td>
            <td>{`${capture.width} x ${capture.height}`}</td>
            <td>{capture.format}</td>
            <td>{capture.recursiveCaptureId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListCapture;
