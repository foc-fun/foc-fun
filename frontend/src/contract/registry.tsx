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
    const code = string.charCodeAt(i);
    const hexChar = code.toString(16);
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

export const registerContractCall = async (account: any, contractAddress: string, contractClassHash: string):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const calldata = [contractAddress, contractClassHash];
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

export const unregisterContractCall = async (account: any, contractAddress: string):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const calldata = [contractAddress];
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

export const deployContractCall = async (account: any, contractClassHash: string, calldata: string[]):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const innerCalldata = [contractClassHash, calldata.length, ...calldata];
    console.log("Deploying contract: ", account, contractClassHash, calldata);
    printCalldata(innerCalldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "deploy_contract",
        calldata: innerCalldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash, result);
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

export const registerEventsCall = async (account: any, contractAddress: string, eventSelectors: string[]):
  Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const executeData = eventSelectors.map((selector) => {
      return {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "register_event",
        calldata: [contractAddress, selector]
      }
    });
    console.log("Registering events: ", account, executeData);
    const result = await account.execute([
      ...executeData
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

export const fullSetupCall = async (account: any, classHash: string, className: string, classVersion: string,
  callData: string[], eventSelectors: string[]): Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const classCalldata = [classHash, feltString(className), feltString(classVersion), callData.length, ...callData, eventSelectors.length, ...eventSelectors];
    printCalldata(classCalldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "full_setup",
        calldata: classCalldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash);
    return result;
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}

export const deployAndRegisterCall = async (account: any, contractClassHash: string, calldata: string[], eventSelectors: string[]): Promise<any> => {
  try {
    if (!account) {
      console.error("Account is not connected");
      return null;
    }

    const innerCalldata = [contractClassHash, calldata.length, ...calldata, eventSelectors.length, ...eventSelectors];
    console.log("Deploying contract: ", account, contractClassHash, calldata);
    printCalldata(innerCalldata);
    const result = await account.execute([
      {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        entrypoint: "deploy_and_register",
        calldata: innerCalldata
      }
    ]);
    console.log("Tx hash: ", result.transaction_hash, result);
    return result;
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    console.log("Done");
  }
}
