// ApiNotFoundMiddleware.ts
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class ApiNotFoundMiddleware implements NestMiddleware {
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
