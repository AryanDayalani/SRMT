import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        if (error instanceof ZodError) {
            // Cast error specifically to any to bypass TS check on 'errors' property if mismatch exists
            const zodError = error as any;
            return res.status(400).json({
                message: 'Validation failed',
                errors: zodError.errors?.map((e: any) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })) || [],
            });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
