import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { SesionesModule } from './modules/sesiones/sesiones.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';
import { SupabaseModule } from './config/supabase.module.js';
import { EntitiesModule } from './entities/entities.module.js';
import { SubastasModule } from './modules/subastas/subastas.module';
import { AuctionModule } from './modules/auction/auction.module';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { BandejaModule } from './modules/bandeja/bandeja.module.js';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get<string>('DB_NAME') || 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        ssl:
          config.get('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        extra: {
          max: 10, // máximo de conexiones en el pool
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
        retryAttempts: 5, // reintenta si Supabase no responde al iniciar
        retryDelay: 3000,
        autoLoadEntities: true,
      }),
    }),
    EntitiesModule,
    UsuariosModule,
    SesionesModule,
    AuthModule,
    CommonModule,
    SupabaseModule,
    SubastasModule,
    AuctionModule,
    NotificationsModule,
    BandejaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

