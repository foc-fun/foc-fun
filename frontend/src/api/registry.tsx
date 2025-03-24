import axios from 'axios';
import { focFunUrl } from "./requests";

export const addContractClass = async (contractClassHash: string, contractClassFile: File) => {
  let formattedHash = contractClassHash;
  if (formattedHash.startsWith('0x')) {
    formattedHash = formattedHash.slice(2);
  }
  const paddedHash = formattedHash.padStart(64, '0');
  formattedHash = `0x${paddedHash}`;

  const formData = new FormData();
  formData.append('hash', formattedHash);
  formData.append('contract', contractClassFile as any);

  try {
    // TODO: Check class hash on backend
    console.log('Adding contract class...', formattedHash);
    const response = await axios.post(`${focFunUrl}/registry/add-contract-class`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
}
