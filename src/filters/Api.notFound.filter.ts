// ApiNotFoundFilter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(NotFoundException)
export class ApiNotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    response.status(404).json({
      statusCode: 404,
      message: 'Resource not found',
    })
  }
}
