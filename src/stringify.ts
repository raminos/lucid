import { ParsedObject, Property } from "./parse";

type Position = "first" | "last" | "middle";

function getConstructorNameConnectionLine(position: Position): string {
  if (position === "first") {
    return "┌──";
  } else if (position === "last") {
    return "└──";
  } else if (position === "middle") {
    return "├──";
  }

  return undefined as never;
}

function getPropertyConnectionLine(
  position: Position,
  isLastObject: boolean,
): string {
  let result = "";
  if (isLastObject) {
    result = "    ";
  } else {
    result = "│   ";
  }

  if (position === "last") {
    return result + "└──";
  }

  return result + "├──";
}

function getObjectPosition(obj: ParsedObject, isHead: boolean): Position {
  if (!obj.parsedPrototype) {
    return "last";
  }
  if (isHead) {
    return "first";
  }

  return "middle";
}

function getPropertyPosition(currentIndex: number, length: number): Position {
  if (currentIndex === 0 && length > 1) {
    return "first";
  }
  if (currentIndex === length - 1) {
    return "last";
  }

  return "middle";
}

function getConstructorNameLine(
  constructorName: string | undefined,
  position: Position,
  isHead: boolean,
) {
  const placeholder = isHead ? "Initial Object" : "Unnamed Object";
  return `${getConstructorNameConnectionLine(position)} ${
    constructorName ?? placeholder
  }\n`;
}

const getPropertyLines = (isLastObject: boolean) => (
  previousValue: string,
  currentValue: Property,
  currentIndex: number,
  array: Property[],
) => {
  const position = getPropertyPosition(currentIndex, array.length);
  return (
    previousValue +
    `${getPropertyConnectionLine(position, isLastObject)} ${
      currentValue.name
    }: ${currentValue.type.name}\n`
  );
};

export function stringifyParsedPrototypes(
  obj: ParsedObject | undefined,
  isHead = true,
): string {
  if (!obj) {
    return "";
  }

  const position = getObjectPosition(obj, isHead);

  return (
    getConstructorNameLine(obj.constructorName, position, isHead) +
    obj.properties.reduce(getPropertyLines(position === "last"), "") +
    stringifyParsedPrototypes(obj.parsedPrototype, false)
  );
}
