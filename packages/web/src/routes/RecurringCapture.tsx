import React from "react";
import Layout from "../components/Layout";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCaptureList, getRecurringCaptureById } from "../api-services";
import RecurringCaptureForm from "../components/CaptureInput/CaptureRecurringForm";

interface Props {}

const RecurringCapture: React.FC<Props> = () => {
  const { id } = useParams();
  const queryRecurringCapture = useQuery({
    queryKey: ["recurringCapture", id],
    queryFn: () => getRecurringCaptureById(id as string),
  });
  const queryListCapture = useQuery({
    queryKey: ["capture", id],
    queryFn: () =>
      getCaptureList({
        recursiveCaptureId: id,
      }),
  });

  if (queryRecurringCapture.isLoading && queryListCapture.isLoading) {
    return (
      <Layout>
        <div className={"container"}>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        {queryRecurringCapture.isFetched && (
          <div className={"mb-10"}>
            <RecurringCaptureForm
              className="mt-6 w-1/2 mx-auto"
              value={queryRecurringCapture.data}
            />
          </div>
        )}

        <div className="">
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
              {queryListCapture.data?.map((capture) => (
                <tr key={capture.id}>
                  <td>
                    <Link
                      to={`/capture/${capture.id}`}
                      className="text-blue-500"
                    >
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
        </div>
      </div>
    </Layout>
  );
};

export default RecurringCapture;
