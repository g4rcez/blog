import { z } from "zod";

export namespace MarkdownValidator {
    const paginateDefault = { page: 0, pageSize: 2 };
    const paginate = z.object({
        page: z.coerce.number().min(0),
        pageSize: z.coerce.number().min(1).max(20),
    }).default(paginateDefault);

    export const getPagination = (input: any): z.infer<typeof paginate> => {
        const validation = paginate.safeParse(input);
        if (validation.success) return validation.data;
        return paginateDefault;
    }
}