import inquirer from "inquirer";

export const askConversionConfig = () => {
  const questions = [
    {
      name: "url",
      type: "input",
      message: "Enter the website url you want to convert",
      default: "https://www.google.com/",
      validate: (value?: string) => {
        if (value?.length) {
          return true;
        } else {
          return "Enter the website url you want to convert";
        }
      },
    },
    {
      name: "outputFile",
      type: "input",
      message: "Enter the output filename",
      default: "out",
      validate: (value?: string) => {
        if (value?.length) {
          return true;
        } else {
          return "Enter the output filename";
        }
      },
    },
    {
      name: "extension",
      type: "list",
      message: "Choose the desired file format",
      choices: ["PDF", "PNG", "DOCX"],
      default: "PDF",
      validate: (value?: string) => {
        if (value?.length) {
          return true;
        } else {
          return "Choose the desired file format";
        }
      },
    },
    {
      name: "size",
      type: "list",
      message: "Enter the wanted output size",
      choices: ["A4", "A3", "letter"],
      default: "A4",
      validate: (value?: string) => {
        if (value?.length) {
          return true;
        } else {
          return "Enter the wanted output size";
        }
      },
    },
    {
      name: "mobileViewport",
      type: "confirm",
      message: "Simulate a mobile viewport?",
    },
  ];
  return inquirer.prompt(questions);
};
