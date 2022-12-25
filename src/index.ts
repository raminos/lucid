import { parsePrototypes } from "./parse";
import { stringifyParsedPrototypes } from "./stringify";

export { parsePrototypes, stringifyParsedPrototypes };

export const Lucid = {
  log: (obj: unknown): void => {
    console.log(stringifyParsedPrototypes(parsePrototypes(obj)));
  },
  parse: parsePrototypes,
  stringify: stringifyParsedPrototypes,
};
