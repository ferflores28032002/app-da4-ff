import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OnModuleInit } from '@nestjs/common/interfaces'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    CommonModule,
    ProductModule,
    CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    console.log(`Conectado con exito ala base de datos --> ${process.env.DB_DATABASE}`);
  }
}