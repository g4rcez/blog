import { Db } from ".";

export namespace Users {
  export const create = async () => {
    await Db.user.create({
      data: {
        email: "allan.f.garcez@gmail.com",
        name: "g4rcez",
      },
    });
  };
}
