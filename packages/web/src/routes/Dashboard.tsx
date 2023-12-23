import React, { useState } from "react";
import clsx from "clsx";
import Layout from "../components/Layout";
import ListCapture from "../components/ListCapture";
import ListRecurringCapture from "../components/ListRecurringCapture";
import Tab from "../components/Tab";

interface Props {
  className?: string;
}

type Tabs = "capture" | "recurring-capture";

const Dashboard: React.FC<Props> = () => {
  // state tab
  const [tab, setTab] = useState<Tabs>("capture");

  return (
    <Layout>
      <div className="container">
        <Tab
          options={[
            { label: "List Capture", value: "capture" },
            { label: "List Recurring Capture", value: "recurring-capture" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as any)}
        />

        {tab === "capture" && (
          <div className="mb-4">
            {/* h3 list capture */}
            <h3 className="text-2xl font-bold">List Capture</h3>
            <ListCapture />
          </div>
        )}

        {tab === "recurring-capture" && (
          <div>
            {/* h3 list recurring capture */}
            <h3 className="text-2xl font-bold">List Recurring Capture</h3>
            <ListRecurringCapture />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
