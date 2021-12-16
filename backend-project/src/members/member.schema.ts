import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from 'src/books/book.schema';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export type MemberDocument = Member & Document;

@Schema()
export class Member {
  @Prop()
  @ApiProperty()
  code: string;

  @Prop()
  @ApiProperty()
  name: string;

  @Prop({ default: false })
  @ApiProperty()
  penalized: boolean;

  @Prop({ type: [Types.ObjectId], ref: Book.name })
  @ApiProperty()
  //   @Type(() => Book)
  books: Book[];

  @Prop({ type: Date, default: new Date('2020-01-01') })
  @ApiProperty()
  endPenalized: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
