import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    // Configuration de TypeORM avec SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'database.sqlite'),
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true, // À désactiver en production
    }),
    // Import de tous les modules de l'application
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    AuthModule,
    MessagesModule,
    CartModule,
  ],
})
export class AppModule {}
