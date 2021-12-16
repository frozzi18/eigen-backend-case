import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './books/book.module';

import { MemberModule } from './members/member.module';

@Module({
  imports: [
    BookModule,
    MemberModule,
    MongooseModule.forRoot('mongodb://localhost:27017/backendCase'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
