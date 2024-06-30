import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('multi/:alias')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AnyFilesInterceptor())
  async uploads(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('alias') alias: string,
  ) {
    return await this.uploadService.saveMultiFiles(files, alias)
  }

  @Post(':alias')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('alias') alias: string,
  ) {
    return await this.uploadService.saveFile(file, alias)
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@Body() path: { path: string }) {
    return await this.uploadService.deleteFile(path.path)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllFilesPaths() {
    return this.uploadService.filndAllFilesPaths()
  }
}
