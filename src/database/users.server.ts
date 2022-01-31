import { Db } from ".";

export namespace Users {
  export type User = NonNullable<ReturnType<typeof get>>;
  export const get = async (serviceId: string, serviceType = "github") =>
    Db.users.findFirst({
      where: {
        authService: serviceType,
        authServiceId: serviceId,
      },
    });

  export const getById = async (id: string) => Db.users.findFirst({ where: { id } });
}
