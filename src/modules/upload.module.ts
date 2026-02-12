import { Module } from '@nestjs/common';
import { UploadController } from '@presentation/controllers/upload.controller';

@Module({
    controllers: [UploadController],
})
export class UploadModule { }
