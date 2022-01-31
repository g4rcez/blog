import { DataFunctionArgs } from "@remix-run/server-runtime";
import { OmitKeys } from "./lib/utility-types";

export namespace Remix {
  type RemixFormData<T> = OmitKeys<FormData, "get"> & {
    get: <K extends keyof T>(key: K) => T[K];
  };

  type RemixResponse<T = any> = OmitKeys<Response, "json"> & {
    json: () => Promise<T>;
    formData: () => RemixFormData<T>;
  };

  export type LoaderFunction<T = any> = (args: DataFunctionArgs) => Promise<RemixResponse | T> | RemixResponse | T;

  export const FormActionKey = "_action";
}

export namespace Validation {
  export type Error<T extends {}> = Record<keyof T, string[]>;
}

