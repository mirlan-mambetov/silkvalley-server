import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
// import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { NotFoundExceptionFilter } from './filters/NotFound.filters'
import { PrismaService } from './prisma.service'

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
    ConfigModule.forRoot(),
    
  ],
  controllers: [AppController],

  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
