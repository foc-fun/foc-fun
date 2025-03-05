import types from "./types.json";

// TODO: tuples
export const isPrimitiveType = (typeName: string): boolean => {
  return types.primitives.find((primitive) => primitive.type === typeName) !== undefined;
}

export const isArrayType = (typeName: string): boolean => {
  return types.array.find((array) => typeName.startsWith(array.type)) !== undefined;
}

export const isStructType = (typeName: string): boolean => {
  return !isPrimitiveType(typeName) && !isArrayType(typeName);
}

// TODO: color to linear gradient
export const getTypeColor = (typeName: string): string => {
  const defaultColor = "#d030d0";
  if (isPrimitiveType(typeName)) {
    return types.primitives.find((primitive) => primitive.type === typeName)?.color || defaultColor;
  } else if (isArrayType(typeName)) {
    return types.array.find((array) => typeName.startsWith(array.type))?.color || defaultColor;
  } else if (isStructType(typeName)) {
    return defaultColor;
  }
  return defaultColor;
}

export const getTypeName = (typeName: string): string => {
  const strippedTypeName = typeName.split("::").pop() || typeName;
  if (isPrimitiveType(typeName)) {
    return types.primitives.find((primitive) => primitive.type === typeName)?.name || strippedTypeName;
  } else if (isArrayType(typeName)) {
    return getTypeName(typeName.split("<")[1].split(">")[0]);
  } else if (isStructType(typeName)) {
    return strippedTypeName;
  }
  return strippedTypeName;
}

export const parseStarknetType = (typeName: string, abi: any): any => { 
  if (isPrimitiveType(typeName)) {
    return {
      kind: "primitive",
      rawType: typeName,
      type: getTypeName(typeName),
      color: getTypeColor(typeName),
    }
  } else if (isArrayType(typeName)) {
    return {
      kind: "array",
      rawType: typeName,
      type: getTypeName(typeName),
      color: getTypeColor(typeName),
    }
  } else if (isStructType(typeName)) {
    return {
      kind: "struct",
      rawType: typeName,
      type: getTypeName(typeName),
      color: getTypeColor(typeName),
      fields: abi.find((abi: any) => abi.name === typeName)?.members?.map((member: any) => {
        return {
          name: member.name,
          type: parseStarknetType(member.type, abi),
        }
      }
    )}
  }
  return {
    kind: "unknown",
    rawType: typeName,
    type: getTypeName(typeName),
    color: getTypeColor(typeName),
  }
}
