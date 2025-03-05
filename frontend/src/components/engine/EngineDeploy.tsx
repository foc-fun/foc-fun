import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import { ContractInput } from "./ContractInput";

import upload from "../../../public/icons/upload.png";
import uploaded from "../../../public/icons/uploaded.png";
// import edit from "../../../public/icons/edit.png";

// TODO: no compiled_contract_class.json?
// TODO: All spots null is returned, send err
// TODO: Issue where bg turns white when selecting input text from dropdown
// TODO: Save config option
// TODO: Load config option
// TODO: Bug when switching to contract w/ no calldata from one w/ calldata
// TODO: Deploy: 
//        - Check all inputs are filled & valid
//        - Send to Registry w/ hash of all data & contract hash
//        - Send to backend w/ hash of all data & contract hash
export default function EngineDeploy(_props: any) {
  const sierraFileRef = useRef<HTMLInputElement>(null);
  const [sierraFile, setSierraFile] = useState<File | null>(null);

  const [contractAbi, setContractAbi] = useState<any[]>([]);
  const [constructorInputs, setConstructorInputs] = useState<any[]>([]);
  const handleSierraFileChange = (e: any) => {
    if (!e.target) return;
    const file = e.target.files[0];
    setSierraFile(file);
  }
  useEffect(() => {
    // Parse the file
    if (!sierraFile) return;
    sierraFile.text().then((text) => {
      const jsonData = JSON.parse(text);
      if (!jsonData.abi || jsonData.abi.length === 0) return;
      const abi = jsonData.abi;
      setContractAbi(abi);
      const constructorInputs = abi.find((item: any) => item.type === "constructor")?.inputs;
      if (!constructorInputs) return;
      setConstructorInputs(constructorInputs);
    });
  }, [sierraFile]);

  const handleFileDragOver = (e: any) => {
    e.preventDefault();
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-[3.2rem] m-8">Starknet Contract Deployer</h1>
      <div className="w-full flex-grow flex flex-row items-center p-[2rem] gap-[2rem]">
        <div className="Form__input h-[50%] w-[30%]">
          <label
            className="Form__file"
            htmlFor="file"
            onDrop={handleSierraFileChange}
            onDragOver={handleFileDragOver}
          >
            {sierraFile ? (
              <div className="flex flex-col items-center justify-center w-full h-full gap-1 relative overflow-hidden">
                <Image src={uploaded} alt="Uploaded" className="w-[10rem] h-[10rem] m-6" />
                <p className="text-[2rem] text-center p-[1rem] pb-0">Sierra Contract Uploaded</p>
                <p className="text-[1.2rem] text-center p-0">Filename: {sierraFile.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                <Image src={upload} alt="Upload" className="w-[10rem] h-[10rem] m-6" />
                <p className="text-[2rem] text-center p-[2rem] pb-0">Upload a Sierra `.contract_class.json`</p>
              </div>
            )}
          </label>
          <input
            type="file"
            id="file"
            accept="contract_class.json"
            ref={sierraFileRef}
            style={{ display: "none" }}
            onChange={handleSierraFileChange}
          />
        </div>
        <div className="flex flex-col w-[70%] justify-center">
          {sierraFile ? (
            <div>
              <div className="flex flex-row items-center gap-2">
                <h2 className="text-[2.4rem]">Deployment Config :</h2>
                <input
                  className="Form__text text-[2rem] ml-[1rem] pl-[1rem] pt-[0.5rem] mb-[1rem]"
                  type="text"
                  id="contractName"
                  placeholder="Contract Name"
                />
              </div>
              {constructorInputs && constructorInputs.length > 0 && (
                <div>
                <h2 className="text-[2.4rem]">Constructor :</h2>
                <div className="flex flex-col gap-4 h-[40rem] overflow-y-scroll bg-[#000000a0] rounded-xl w-min py-[1rem] pr-[2rem]
                  border-[2px] border-[var(--foreground)]">
                  {constructorInputs.map((input: any, idx: number) => (
                    <ContractInput key={idx} input={input} abi={contractAbi} />
                  ))}
                </div>
                </div>
              )}
              <div className="flex flex-row">
                <button className="Button__secondary px-[1rem] py-[0.5rem] pt-[1rem] mt-[1rem]">Deploy</button>
                <button className="Button__secondary px-[1rem] py-[0.5rem] pt-[1rem] mt-[1rem] ml-[1rem]">Save</button>
                <button className="Button__secondary px-[1rem] py-[0.5rem] pt-[1rem] mt-[1rem] ml-[1rem]">Load</button>
              </div>
            </div>
          ) : (
            <h2 className="text-[3rem] text-center">Upload a Sierra Contract to get started.</h2>
          )}
        </div>
      </div>
    </div>
  );
}
