import { stringifyParsedPrototypes } from "../stringify";
import { objectParsedObject } from "../test-helpers";

it("tests a simple parsed class", () => {
  expect(
    stringifyParsedPrototypes({
      constructorName: undefined,
      properties: [
        {
          name: "a",
          type: {
            name: "string",
            description: '"Hello"',
          },
        },
      ],
      parsedPrototype: {
        constructorName: "Test",
        properties: [
          {
            name: "b",
            type: {
              name: "function",
              description: "b",
            },
          },
        ],
        parsedPrototype: objectParsedObject,
      },
    }),
  ).toEqual(
    `┌── Initial Object
│   └── a: string
├── Test
│   └── b: function
└── Object
    ├── __defineGetter__: function
    ├── __defineSetter__: function
    ├── hasOwnProperty: function
    ├── __lookupGetter__: function
    ├── __lookupSetter__: function
    ├── isPrototypeOf: function
    ├── propertyIsEnumerable: function
    ├── toString: function
    ├── valueOf: function
    ├── __proto__: undefined
    └── toLocaleString: function
`,
  );
});
