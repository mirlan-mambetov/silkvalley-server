// ApiNotFoundMiddleware.ts
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { ApiNotFoundFilter } from 'src/filters/Api.notFound.filter'

@Injectable()
export class ApiNotFoundMiddleware implements NestMiddleware {
  private readonly filter = new ApiNotFoundFilter()

  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.startsWith('/api/')) {
      next()
    } else {
      res.status(HttpStatus.NOT_FOUND).render('404', {
        message: 'NOT FOUND',
        title: 'NOT FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      })
    }
  }
}
