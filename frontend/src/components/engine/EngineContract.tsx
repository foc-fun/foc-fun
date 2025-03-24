import Image from "next/image";
import { useEffect, useState } from "react";
import { getContractClass, getContractsEvents } from "../../api/registry";
import EngineInvoke from "./EngineInvoke";
import EngineIndex from "./EngineIndex";
import EngineInspect from "./EngineInspect";
import EngineAPI from "./EngineAPI";
import copyIcon from "../../../public/icons/copy.png";

export default function EngineContracts(props: any) {
  const [contractClass, setContractClass] = useState<any>(null);
  const [contractEvents, setContractEvents] = useState<any>(null);
  useEffect(() => {
    try {
      const fetchContractClass = async () => {
        const contractClassData = await getContractClass(props.classHash);
        setContractClass(contractClassData);
      }
      const fetchContractEvents = async () => {
        const contractEventsData = await getContractsEvents(props.address);
        setContractEvents(contractEventsData);
      }
      fetchContractClass();
      fetchContractEvents();
    } catch (error) {
      console.error("Error fetching contract data:", error);
    }
  }, [props.classHash, props.address]);
  const shortenHash = (hash: string) => {
    if (!hash) return '';
    return hash.length > 10 ? `${hash.slice(0, 5)}...${hash.slice(-5)}` : hash;
  }

  const redeployContract = async (address: string) => {
    try {
      // Add your redeploy logic here
      console.log(`Redeploying contract at address: ${address}`);
    } catch (error) {
      console.error("Error redeploying contract:", error);
    }
  }

  const [tabs, _setTabs] = useState([
    { name: "Invoke" },
    { name: "Index" },
    { name: "Inspect" },
    { name: "API" },
  ]);
  const [selectedTab, setSelectedTab] = useState(tabs[0].name);
  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-[3.2rem] m-8">Contract {props.name}</h1>
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-center items-center">
          <h2 className="text-[2rem] m-8">Class Hash: {shortenHash(props.classHash)}</h2>
          <button
            className="ml-4"
            onClick={() => navigator.clipboard.writeText(props.classHash)}
          >
            <Image src={copyIcon} alt="Copy" className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full flex justify-center items-center">
          <h2 className="text-[2rem] m-8">Address: {shortenHash(props.address)}</h2>
          <button
            className="ml-4"
            onClick={() => navigator.clipboard.writeText(props.addHash)}
          >
            <Image src={copyIcon} alt="Copy" className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => redeployContract(props.address)}
          >
            Redeploy
          </button>
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-center mt-8">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="w-full text-left px-4 py-2 hover:bg-gray-200"
            onClick={() => setSelectedTab(tab.name)}
            style={{
              backgroundColor: selectedTab === tab.name ? '#e2e8f030' : 'transparent',
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="w-full flex flex-col items-center mt-4">
        {selectedTab === "Invoke" && <EngineInvoke class={contractClass} address={props.address} events={contractEvents} />}
        {selectedTab === "Index" && <EngineIndex class={contractClass} address={props.address} events={contractEvents} />}
        {selectedTab === "Inspect" && (
          <EngineInspect class={contractClass} address={props.address} events={contractEvents} />
        )}
        {selectedTab === "API" && (
          <EngineAPI class={contractClass} address={props.address} events={contractEvents} />
        )}
      </div>
    </div>
  );
}
