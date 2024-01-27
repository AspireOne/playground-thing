/** Generate a random UUID */
export const genRandomUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise, no-mixed-operators
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const log = (message: string, ...optionalParams: any[]) => {
  console.log(
    `%c[Playground Enhancer] ${message}`,
    "color: lightgreen; font-weight: bold",
    ...optionalParams,
  );
};

export const logErr = (message: string, ...optionalParams: any[]) => {
  console.error(
    `%c[Playground Enhancer] ${message}`,
    "color: red; font-weight: bold",
    ...optionalParams,
  );
};

export const logWarn = (message: string, ...optionalParams: any[]) => {
  console.warn(
    `%c[Playground Enhancer] ${message}`,
    "color: orange; font-weight: bold",
    ...optionalParams,
  );
};
