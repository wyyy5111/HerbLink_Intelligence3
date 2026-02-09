import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { apiResponse } from '@/utils/apiResponse.js'

export const validate =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }))
        return apiResponse.error(res, '数据验证失败', 400, errors)
      }
      next(error)
    }
  }

export const validateBody = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }))
      return apiResponse.error(res, '数据验证失败', 400, errors)
    }
    next(error)
  }
}
