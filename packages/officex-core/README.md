# @officex/core

URL to PDF, JSON, TXT, PNG converter for Node.js.

## 🛠️ Installation

```
npm i @officex/core
```

```
yarn add @officex/core
```

## 💻 Usage

```typescript
import { convert, getBrowser, IConverterConfig } from "@officex/core";

const DEFAULT_CONFIG: IConverterConfig = {
  url: "https://google.com",
  outputFile: "google.pdf",
  size: "Letter",
  extension: "PDF",
  mobileViewport: false,
  flushToDisk: false,
};

async function convertWebpage(config: IConverterConfig = DEFAULT_CONFIG) {
  try {
    return await convert(await getBrowser(), config);
  } catch (error) {
    console.error(error);
  }
}
```

## 📑 License

The project is licensed under the [GNU General Public License v3.0](https://github.com/I-Atlas/officex/blob/main/packages/officex-core/LICENSE).
