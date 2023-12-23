import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { getRecurringCaptureList } from "../api-services";
import Spinner from "../components/Spinner";

interface Props {
  className?: string;
}

const ListRecurringCapture: React.FC<Props> = () => {
  const queryCaptureList = useQuery({
    queryKey: ["listRecurringCapture"],
    queryFn: () => getRecurringCaptureList(),
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
      <thead>
        <tr>
          <th>Id</th>
          <th>Created Date</th>
          <th>Recurring type</th>
          <th>Website</th>
          <th>Width x Height</th>
          <th>End Date</th>
          <th>Type Image</th>
        </tr>
      </thead>
      <tbody>
        {queryCaptureList.data?.map((capture) => (
          <tr key={capture.id}>
            <td>
              <Link to={`/recurring-capture/${capture.id}`} className="text-blue-500">
                {capture.id}
              </Link>
            </td>
            <td>{new Date(capture.createdAt).toString()}</td>
            <td>{capture.schedule}</td>
            <td>{capture.website}</td>
            <td>{`${capture.width} x ${capture.height}`}</td>
            <td>{capture.endTime && new Date(capture.endTime).toString()}</td>
            <td>{capture.format}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListRecurringCapture;