import { useEffect, useState } from "react";

type EngineInvokable = {
  interface: string;
  mutability: string;
  name: string;
  inputs: any[];
  outputs: any[];
}

export default function EngineInvoke(props: any) {
  const [getInvokables, setGetInvokables] = useState<any>(null);
  const [setInvokables, setSetInvokables] = useState<any>(null);
  useEffect(() => {
    if (!props.class) return;
    const newGetInvokables: EngineInvokable[] = [];
    const newSetInvokables: EngineInvokable[] = [];
    const newInvokables: EngineInvokable[] = [];
    const entries = Object.entries(props.class.data.abi) as any[];
    for (const [_, entry] of entries) {
      if (entry.type === "interface") {
        // Interface entry ( substring after last ::)
        const interfaceName = entry.name.substring(entry.name.lastIndexOf("::") + 2);
        const items = Object.entries(entry.items) as any[];
        for (const [_, item] of items) {
          // TODO: Parse starknet types & display like constructor params on deploy
          const inputs = item.inputs || [];
          const outputs = item.outputs || [];
          const mutability = item.state_mutability || "view"; // default to read
          const name = item.name || "unknown";
          const invokable: EngineInvokable = {
            interface: interfaceName,
            mutability,
            name,
            inputs,
            outputs
          };
          if (mutability === "view" || mutability === "pure") {
            newGetInvokables.push(invokable);
          } else if (mutability === "external" || mutability === "payable") {
            newSetInvokables.push(invokable);
          }
          newInvokables.push(invokable);
        }
      }
    }
    setGetInvokables(newGetInvokables);
    setSetInvokables(newSetInvokables);
  }, [props.class]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-1/2 flex flex-col">
          <h2 className="text-lg font-bold">Get Invokables</h2>
          <ul className="list-disc pl-5">
            {getInvokables && getInvokables.map((invokable: EngineInvokable, index: number) => (
              <li key={index}>
                {invokable.interface}::{invokable.name}({invokable.inputs.map((input: any) => input.type).join(", ")})
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full h-[4rem]"/>
        <div className="w-full h-1/2 flex flex-col">
          <h2 className="text-lg font-bold">Set Invokables</h2>
          <ul className="list-disc pl-5">
            {setInvokables && setInvokables.map((invokable: EngineInvokable, index: number) => (
              <li key={index}>
                {invokable.interface}::{invokable.name}({invokable.inputs.map((input: any) => input.type).join(", ")})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
