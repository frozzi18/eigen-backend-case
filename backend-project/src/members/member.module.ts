import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from 'src/books/book.module';
import { Book, BookSchema } from 'src/books/book.schema';
import { BookService } from 'src/books/book.service';
import { MemberController } from './member.controller';
import { Member, MemberSchema } from './member.schema';
import { MemberService } from './member.service';

@Module({
  imports: [
    // BookModule,
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Book.name, schema: BookSchema },
    ]),
  ],
  controllers: [MemberController],
  providers: [MemberService, BookService],
})
export class MemberModule {}
