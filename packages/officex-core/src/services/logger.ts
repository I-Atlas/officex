import { Extensions } from "../types";

export function debug(...args: any[]) {
  console.debug(
    `[OfficeX] - ${new Date(Date.now()).toLocaleString()}`,
    ...args,
  );
}

export function error(...args: any[]) {
  console.error(
    `[OfficeX] - ${new Date(Date.now()).toLocaleString()}`,
    ...args,
  );
}

export function info(...args: any[]) {
  console.info(`[OfficeX] - ${new Date(Date.now()).toLocaleString()}`, ...args);
}

export function startParsing(
  url: string,
  extension: Extensions,
  config: object,
) {
  debug(`Started parsing ${url} to ${extension} with config: `, config);
}

export function errorParsing(
  url: string,
  extension: Extensions,
  config: object,
) {
  error(
    `Encountered error while parsing ${url} to ${extension} with config: `,
    config,
  );
}

export function finishParsing(url: string, extension: Extensions) {
  info(`Finished parsing ${url} to ${extension}`);
}
