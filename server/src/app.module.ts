import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLError } from 'graphql';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './health/health.module';
import { AbilityModule } from './ability/ability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      playground: false,
      context: ({ req }) => ({ req }),
      driver: ApolloDriver,
      autoSchemaFile: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      formatError: (error: GraphQLError) => {
        error.extensions.stacktrace = undefined;
        return error;
      },
    }),
    PrismaModule,
    HealthModule,
    AbilityModule,
    CoreModule,
  ],
  providers: [AppService],
})
export class AppModule {}
