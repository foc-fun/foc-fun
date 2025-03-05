'use client';

import { useState } from "react";
import EngineAPI from "../engine/EngineAPI";
import EngineDeploy from "../engine/EngineDeploy";
import EngineIndex from "../engine/EngineIndex";
import EngineInspect from "../engine/EngineInspect";

const Engine = () => {
  const tabOptions = [
    {
      name: "API",
      component: <EngineAPI />,
    },
    {
      name: "Deploy",
      component: <EngineDeploy />,
    },
    {
      name: "Invoke",
      component: <EngineDeploy />,
    },
    {
      name: "Index",
      component: <EngineIndex />,
    },
    {
      name: "Inspect",
      component: <EngineInspect />,
    },
    {
      name: "Pipelines",
      component: <EngineDeploy />,
    },
  ];
  const [activeTab, setActiveTab] = useState(tabOptions[1]);

  return (
    <div className="w-full h-full flex flex-row align-center">
      <div className="flex flex-col justify-center pl-[8rem] pr-[2rem] gap-10
                      border-r-[2px] border-t-[2px] border-[#ffffff20] mt-[7rem] bg-[#000000c0]">
        {tabOptions.map((tab, index) => (
          <div
            key={index}
            className="text-[3.4rem] text-right Button__empty"
            style={{ color: activeTab.name === tab.name ? "#ffffff" : "#ffffff50" }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className="border-t-[2px] border-[#ffffff20] w-full mt-[7rem] bg-[#000000c0]">
        {activeTab.component}
      </div>
    </div>
  );
};

export default Engine;
