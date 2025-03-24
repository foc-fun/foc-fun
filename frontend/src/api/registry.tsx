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

export const getRegisteredContracts = async (pageLength: number = 10, pageNumber: number = 0) => {
  try {
    console.log('Fetching registered contracts...');
    const response = await axios.get(`${focFunUrl}/registry/get-registered-contracts?pageLength=${pageLength}&page=${pageNumber}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const getRegisteredClasses = async (pageLength: number = 10, pageNumber: number = 0) => {
  try {
    console.log('Fetching registered classes...');
    const response = await axios.get(`${focFunUrl}/registry/get-registered-classes?pageLength=${pageLength}&page=${pageNumber}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const getContractClass = async (contractClassHash: string) => {
  let formattedHash = contractClassHash;
  if (formattedHash.startsWith('0x')) {
    formattedHash = formattedHash.slice(2);
  }
  const paddedHash = formattedHash.padStart(64, '0');
  formattedHash = `0x${paddedHash}`;

  try {
    console.log('Fetching contract class...', formattedHash);
    const response = await axios.get(`${focFunUrl}/registry/get-contract-class?hash=${formattedHash}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const getContractsEvents = async (contractAddress: string, pageLength: number = 10, pageNumber: number = 0) => {
  let formattedAddress = contractAddress;
  if (formattedAddress.startsWith('0x')) {
    formattedAddress = formattedAddress.slice(2);
  }
  const paddedAddress = formattedAddress.padStart(64, '0');
  formattedAddress = `${paddedAddress}`;
  try {
    console.log('Fetching contract events...', contractAddress);
    const response = await axios.get(`${focFunUrl}/registry/get-contracts-events?address=${contractAddress}&pageLength=${pageLength}&page=${pageNumber}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
