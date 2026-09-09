import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { DATABASE_CONFIG } from "./database.config";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

    constructor(private readonly config: ConfigService) { }

    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        const dbConfig = this.config.getOrThrow<TypeOrmModuleOptions>(DATABASE_CONFIG);

        return {
            ...dbConfig,
        };
    }
}