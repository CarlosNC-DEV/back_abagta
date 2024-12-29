import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { errorResponseZod } from "./response.middleware";

export const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponseZod(res, "Validation error", 400, error.errors);
      }

      return errorResponseZod(res, "Validation error", 400, []);
    }
  };
};
