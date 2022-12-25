export type ParsedObject = {
  constructorName: string | undefined;
  properties: Property[];
  parsedPrototype: ParsedObject | undefined;
};

export type ParsedType = {
  name: string;
  description: string | undefined;
};

export type Property = {
  name: string;
  type: ParsedType;
};

export type Options = {
  includeConstructor: boolean;
};

const isPlainObject = (obj: Record<string, any>) => {
  if (
    (obj.prototype === null ||
      Object.getPrototypeOf(obj) === Object.prototype) &&
    !Object.getOwnPropertyNames(obj).includes("constructor")
  ) {
    return true;
  }
  return false;
};

const getParsedType = (obj: unknown): ParsedType => {
  if (["boolean", "string"].includes(typeof obj)) {
    return { name: typeof obj, description: JSON.stringify(obj) };
  } else if (typeof obj === "number") {
    return {
      name: "number",
      description: Number.isNaN(obj) ? "NaN" : obj.toString(),
    };
  } else if (obj === "undefined") {
    return { name: "undefined", description: undefined };
  } else if (typeof obj === "bigint") {
    return { name: "bigint", description: obj.toString() };
  } else if (obj === null) {
    return { name: "null", description: undefined };
  } else if (typeof obj === "symbol") {
    return { name: "symbol", description: obj.description };
  } else if (typeof obj === "function") {
    return {
      name: "function",
      description: obj.name === "" ? "anonymous" : obj.name,
    };
  } else if (Array.isArray(obj)) {
    return { name: "Array", description: obj.length.toString() };
  } else if (obj instanceof Date) {
    return { name: "Date", description: obj.toISOString() };
  } else if (obj instanceof RegExp) {
    return { name: "RegExp", description: `/${obj.source}/${obj.flags}` };
  } else if (obj instanceof Map) {
    return { name: "Map", description: obj.size.toString() };
  } else if (obj instanceof Set) {
    return { name: "Set", description: obj.size.toString() };
  } else if (obj && isPlainObject(obj)) {
    return {
      name: "object",
      description: Object.getOwnPropertyNames(obj).length.toString(),
    };
  } else if (obj && Object.getOwnPropertyNames(obj).includes("constructor")) {
    return {
      name: `${obj.constructor.name}.prototype`,
      description: Object.getOwnPropertyNames(obj).length.toString(),
    };
  } else if (
    obj &&
    Object.getPrototypeOf(obj) &&
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), "constructor")
  ) {
    return { name: obj.constructor.name, description: undefined };
  }

  return { name: typeof obj, description: undefined };
};

const getPropertyFromDescriptorEntry = ([name, descriptor]: [
  string,
  TypedPropertyDescriptor<unknown> & PropertyDescriptor,
]): Property => {
  return {
    name,
    type: getParsedType(descriptor.value),
  };
};

const getProperties = (obj: unknown, options: Options) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  let descriptorEntries = Object.entries(descriptors);
  if (!options.includeConstructor) {
    descriptorEntries = descriptorEntries.filter(
      ([name]) => name !== "constructor",
    );
  }
  return descriptorEntries.map(getPropertyFromDescriptorEntry);
};

export const parsePrototypes = (
  obj: unknown,
  options: Options = { includeConstructor: false },
): ParsedObject | undefined => {
  if (!obj) {
    return undefined;
  }

  let name = undefined;
  if (Object.getOwnPropertyNames(obj).includes("constructor")) {
    name = obj.constructor.name;
  }

  return {
    constructorName: name,
    properties: getProperties(obj, options),
    parsedPrototype: parsePrototypes(Object.getPrototypeOf(obj), options),
  };
};
