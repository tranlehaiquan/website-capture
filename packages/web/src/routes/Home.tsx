import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Layout from "../components/Layout";
import CaptureInput, { CaptureInputValues } from "../components/CaptureInput";
import { createCapture, createCaptureRecurring } from "../api-services";
import Spinner from "../components/Spinner";
import { CAPTURE_TYPES, Schedule } from "shared";
import pick from "lodash/pick";

type Payload = {
  width: number;
  height: number;
  format: string;
  uri: string;
  schedule?: any;
  scheduleEndTime?: string;
  scheduleOptions?: {
    minutes?: number;
    hours?: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
};

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

  // mutations recurring
  const mutationRecurring = useMutation({
    mutationFn: createCaptureRecurring,
    onSuccess: (data) => {
      if (data?.id) {
        navigate(`/recurring-capture/${data.id}`);
      }
    },
  });

  const handleSubmit = async (data: CaptureInputValues) => {
    if (data.captureType === CAPTURE_TYPES["One Time"]) {
      await mutation.mutateAsync(data);
      return;
    }

    if (data.captureType === CAPTURE_TYPES.Recurring) {
      const payload: Payload = pick(data, [
        "width",
        "height",
        "format",
        "uri",
        "schedule",
        "scheduleEndTime"
      ]);

      payload.scheduleOptions = {
        minutes: data.minutes,
        hours: data.hours,
      }

      if (data.schedule === Schedule.weekly) {
        payload.scheduleOptions.dayOfWeek = data.dayOfWeek;
      }

      if (data.schedule === Schedule.monthly) {
        payload.scheduleOptions.dayOfMonth = data.dayOfMonth;
      }
      await mutationRecurring.mutateAsync(payload);
      return;
    }
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
