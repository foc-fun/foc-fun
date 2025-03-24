import Image from "next/image";
import { useEffect, useState } from "react";
import { getRegisteredContracts, getRegisteredClasses } from "../../api/registry";
import EngineContract from "./EngineContract";
import copyIcon from "../../../public/icons/copy.png";

export default function EngineContracts() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        // TODO: Pagination
        const data = await getRegisteredContracts();
        setContracts(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // TODO: Combine this with the other api call
  const [classes, setClasses] = useState<any[]>([]);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getRegisteredClasses();
        setClasses(data.data);
      } catch (err) {
        setError(err);
      }
    }
    fetchClasses();
  }, []);

  const shortenHash = (name: string) => {
    if (!name) return "";
    if (name.length > 20) {
      return `0x${name.slice(0, 10)}...${name.slice(-10)}`;
    }
    return name;
  }

  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const selectContract = (address: string) => {
    if (selectedContract === address) {
      setSelectedContract(null);
    } else {
      setSelectedContract(address);
    }
  }
    
  return (
    <div className="w-full h-full flex flex-col items-center">
      {!selectedContract && (
      <>
      <h1 className="text-[3.2rem] m-8">Registered Starknet Contracts</h1>
      {!loading && !error && (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-4">Contract Name</th>
                <th className="border border-gray-200 p-4">Address</th>
                <th className="border border-gray-200 p-4">Class Name</th>
                <th className="border border-gray-200 p-4">Class Version</th>
                <th className="border border-gray-200 p-4">Class Hash</th>
              </tr>
            </thead>
            <tbody>
              {contracts && contracts.map && contracts.map((contract: any) => (
                <tr key={contract.address}>
                  <td className="border border-gray-200 p-4">
                    <div className="flex items-center">
                    <p
                      className={`cursor-pointer ${selectedContract === contract.address ? "font-bold" : ""}`}
                      onClick={() => selectContract(contract.address)}
                    >
                      {classes.find((cls: any) => cls.hash === contract.classHash)?.name || "Unknown"}
                    </p>
                    </div>
                  </td>
                  <td className="border border-gray-200 p-4">
                    <div className="flex items-center">
                    <p>{shortenHash(contract.address)}</p>
                    <Image
                      src={copyIcon}
                      alt="copy"
                      className="w-4 h-4 cursor-pointer ml-2"
                      onClick={() => navigator.clipboard.writeText(contract.address)}
                    />
                    </div>
                  </td>
                  <td className="border border-gray-200 p-4">
                    <div className="flex items-center">
                    <p>{classes.find((cls: any) => cls.hash === contract.classHash)?.name || "Unknown"}</p>
                    </div>
                  </td>
                  <td className="border border-gray-200 p-4">
                    <div className="flex items-center">
                    <p>{classes.find((cls: any) => cls.hash === contract.classHash)?.version || "Unknown"}</p>
                    </div>
                  </td>
                  <td className="border border-gray-200 p-4">
                    <div className="flex items-center">
                    <p>{shortenHash(contract.classHash)}</p>
                    <Image
                      src={copyIcon}
                      alt="copy"
                      className="w-4 h-4 cursor-pointer ml-2"
                      onClick={() => navigator.clipboard.writeText(contract.classHash)}
                    />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error loading contracts: {error.message}</p>}
      </>
      )}
      {selectedContract && (
        <EngineContract address={selectedContract} onClose={() => setSelectedContract(null)}
          name={classes.find((cls: any) => cls.hash === contracts.find((c: any) => c.address === selectedContract)?.classHash)?.name || "Unknown"}
          classHash={contracts.find((c: any) => c.address === selectedContract)?.classHash}
        />
      )}
    </div>
  );
}
