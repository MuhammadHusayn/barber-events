import { createDocument } from './swagger/config';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    SwaggerModule.setup('api-docs', app, createDocument(app));

    await app.listen(3000, () => console.log('App started at http://localhost:3000'));
}
bootstrap();
