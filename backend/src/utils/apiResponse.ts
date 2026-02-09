import { Response } from 'express'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export const apiResponse = {
  // Success response
  success: <T>(res: Response, data: T, message?: string, statusCode: number = 200) => {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    } as ApiResponse<T>)
  },

  // Error response
  error: (res: Response, message: string, statusCode: number = 500, error?: any) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined,
    } as ApiResponse)
  },

  // Paginated response
  paginated: <T>(
    res: Response,
    items: T[],
    total: number,
    page: number,
    pageSize: number,
    message?: string
  ) => {
    return res.status(200).json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      message,
    } as ApiResponse)
  },
}
