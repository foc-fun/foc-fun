const REGISTRY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS || "0x079babba1534a9adb94857a4d29ef98e08526a9268efdb0640a7593f26a93b1d";

const printCalldata = (calldata: any) => {
  let str = "";
  for (let i = 0; i < calldata.length; i++) {
    str += calldata[i].toString() + ",";
  }
  console.log(str);
}

const feltString = (string: string): string => {
  if (!string) {
    return "0x0";
  }
  if (string.length > 31) {
    console.error("String is too long");
    return "";
  }
  // Read utf-8 string into a hex string
  let hex = "";
  for (let i = 0; i < string.length; i++) {
    let code = string.charCodeAt(i);
    let hexChar = code.toString(16);
    hex += hexChar;
  }
  return "0x" + hex;
}

export const registerClassCall = async (account: any, classHash: string, className: string, classVersion: string):
  Promise<any> => {
  try {
    console.log("Registering class: ", account, classHash, className, classVersion);
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const calldata = [classHash, feltString(className), feltString(classVersion)];
    printCalldata(calldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "register_class",
        calldata: calldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash);
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}

export const unregisterClassCall = async (account: any, classHash: string):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const calldata = [classHash];
    printCalldata(calldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "unregister_class",
        calldata: calldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash);
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}

export const deployContractCall = async (account: any, contractHash: string, calldata: string[]):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const innerCalldata = [contractHash, calldata.length, ...calldata];
    printCalldata(innerCalldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "deploy_contract",
        calldata: innerCalldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash);
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}

export const registerContractCall = async (account: any, contractAddress: string, contractHash: string):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const calldata = [contractAddress, contractHash];
    printCalldata(calldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "register_contract",
        calldata: calldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash);
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}

export const unregisterContractCall = async (account: any, contractHash: string):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const calldata = [contractHash];
    printCalldata(calldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "unregister_contract",
        calldata: calldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash);
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}

export const registerEventCall = async (account: any, contractAddress: string, eventSelector: string):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const calldata = [contractAddress, eventSelector];
    printCalldata(calldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "register_event",
        calldata: calldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash);
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}

export const unregisterEventCall = async (account: any, eventId: string):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const calldata = [eventId];
    printCalldata(calldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "unregister_event",
        calldata: calldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash);
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}
