import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),
    ],
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'sqlite',
            database: config.get<string>('DB_NAME'),
            entities: [__dirname + '/../entities/*.entity.{js,ts}'],
            migrations: [__dirname + '/../database/*{.ts,.js}'],
            migrationsTableName: 'migrations',
            synchronize: false,
            logging: false,
            autoLoadEntities: true,
        };
    },
};

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: false,
    entities: [__dirname + '/../entities/*.entity.{js,ts}'],
    migrations: [__dirname + '/../database/*{.ts,.js}'],
    logging: false,
    autoLoadEntities: true,
};
