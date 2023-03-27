export namespace Either {
  export type Left<E> = { error: E; success?: undefined };

  export type Right<S> = { error?: undefined; success: S };

  type Either<L, R> = Left<L> | Right<R>;

  export type Create<L, R> = Either<L, R>;

  class EitherNoValueError extends Error {
    public constructor() {
      super();
      this.message = "EitherError";
    }
  }

  const create = <E, S>(error: E, success: S) => {
    if (error !== undefined) {
      return { error, success: undefined };
    }
    if (success !== undefined) {
      return { success, error: undefined };
    }
    throw new EitherNoValueError();
  };

  export const isLeft = <E, S>(e: Either<E, S>): e is Left<E> =>
    e.error !== undefined;

  export const isRight = <E, S>(e: Either<E, S>): e is Right<S> =>
    e.success !== undefined;

  export const left = <E extends unknown>(e: E): Left<E> =>
    create<E, undefined>(e, undefined) as Left<E>;

  export const right = <S extends unknown>(s: S): Right<S> =>
    create<undefined, S>(undefined, s) as Right<S>;

  export const wrap =
    <Fn extends (...a: any[]) => any, E>(fn: Fn) =>
    (
      ...params: Parameters<Fn>[]
    ): ReturnType<Fn> extends Promise<infer R>
      ? Promise<Either<E, R>>
      : Either<E, ReturnType<Fn>> => {
      try {
        const result = fn(...params);
        if (result instanceof Promise) {
          return result.then(Either.right).catch(Either.left) as any;
        }
        return Either.right(result) as any;
      } catch (e) {
        return Either.left(e) as any;
      }
    };
}
