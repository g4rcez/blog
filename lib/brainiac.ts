import { z } from "zod";

export namespace B {
  export const notEmptyString = z.string().min(1);

  export const datetime = z
    .preprocess((d) => new Date(d as any), z.date())
    .transform((x) => x.toISOString());
}
