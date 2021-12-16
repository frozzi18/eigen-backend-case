import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  @ApiProperty()
  title: string;

  @Prop()
  @ApiProperty()
  code: string;

  @Prop()
  @ApiProperty()
  author: string;

  @Prop()
  @ApiProperty()
  stock: number;

  @Prop({ type: Date, default: new Date('2020-01-01') })
  @ApiProperty()
  startBorrow: Date;

  @Prop({ type: Date, default: new Date('2020-01-01') })
  @ApiProperty()
  endBorrow: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
