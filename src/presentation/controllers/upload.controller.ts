import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const PHOTOS_DIR = join(process.cwd(), 'photos');

// Ensure photos directory exists
if (!existsSync(PHOTOS_DIR)) {
    mkdirSync(PHOTOS_DIR, { recursive: true });
}

const imageFileFilter = (req: any, file: Express.Multer.File, callback: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return callback(new BadRequestException('Допустимы только изображения (jpg, jpeg, png, gif, webp)'), false);
    }
    callback(null, true);
};

const storage = diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, PHOTOS_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

@ApiTags('Загрузка файлов')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
    @Post('photo')
    @ApiOperation({ summary: 'Загрузить одно фото' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage,
            fileFilter: imageFileFilter,
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        }),
    )
    uploadPhoto(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Файл не загружен');
        }

        return {
            url: `/photos/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
        };
    }

    @Post('photos')
    @ApiOperation({ summary: 'Загрузить несколько фото (до 10)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage,
            fileFilter: imageFileFilter,
            limits: { fileSize: 10 * 1024 * 1024 },
        }),
    )
    uploadPhotos(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('Файлы не загружены');
        }

        return files.map((file) => ({
            url: `/photos/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
        }));
    }
}
