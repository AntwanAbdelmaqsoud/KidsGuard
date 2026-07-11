import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export function validate(
  schema: ZodSchema,
  target: "body" | "params" | "query" = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const toValidate = (req as any)[target];
    const result = schema.safeParse(toValidate);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: result.error.format() });
    }
    // overwrite with parsed/typed data
    (req as any)[target] = result.data;
    return next();
  };
}
