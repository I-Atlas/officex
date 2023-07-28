#!/usr/bin/env node

import clear from "clear";
import chalk from "chalk";
import figlet from "figlet";
import { Spinner } from "clui";
import { convert, getBrowser } from "@officex/core";
import { askConversionConfig } from "./inquirer";

clear();

console.log(
  chalk.yellow(figlet.textSync("OFFICEX", { horizontalLayout: "full" }))
);

export const run = async () => {
  try {
    const config = await askConversionConfig();
    const loader = new Spinner(`Converting "${config.url}" please wait...`);
    loader.start();
    const browser = await getBrowser();
    await convert(browser, { ...config, flushToDisk: true });
    loader.stop();
  } catch (error) {
    clear();
    console.log(
      chalk.red(figlet.textSync("ERROR", { horizontalLayout: "full" }))
    );
  }
};

run();
