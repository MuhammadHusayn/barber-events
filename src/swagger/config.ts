import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function createDocument(app: INestApplication): OpenAPIObject {
    const builder = new DocumentBuilder()
        .setDescription('Booking API')
        .setTitle('Booking Api')
        .setVersion('1.0');

    const options = builder.build();
    return SwaggerModule.createDocument(app, options);
}
