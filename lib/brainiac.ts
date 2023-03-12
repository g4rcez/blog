import { z } from "zod";

export namespace B {
  export const notEmptyString = z.string().min(1);

  export const datetime = z.string().datetime().or(z.date());
}
