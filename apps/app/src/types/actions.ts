export type Result<T, E = Error> =
  | { status: "ok"; data: T }
  | { status: "error"; error: E };

export const ok = <T>(data: T): Result<T> => ({
  status: "ok",
  data,
});

export const error = <E>(error: E): Result<never, E> => ({
  status: "error",
  error,
});

export function isOk<T, E>(
  result: Result<T, E>,
): result is { status: "ok"; data: T } {
  return result.status === "ok";
}

export function isError<T, E>(
  result: Result<T, E>,
): result is { status: "error"; error: E } {
  return result.status === "error";
}
