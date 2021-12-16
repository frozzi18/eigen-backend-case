import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mode } from 'fs';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/books/book.schema';
import { BookService } from 'src/books/book.service';
import { Member, MemberDocument } from './member.schema';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private bookService: BookService,
  ) {}

  async create(member: Member): Promise<Member> {
    const newMember = new this.memberModel(member);
    return newMember.save();
  }

  async readAll(): Promise<Member[]> {
    return await this.memberModel.find().exec();
  }

  async readById(id): Promise<Member> {
    return await this.memberModel.findById(id).exec();
  }

  async update(id, member: Member): Promise<Member> {
    return await this.memberModel.findByIdAndUpdate(id, member, { new: true });
  }

  async delete(id): Promise<any> {
    return await this.memberModel.findByIdAndRemove(id);
  }

  // Post borrowed books to user
  async createBorrowBooks(memberId, bookId): Promise<Member> {
    const resetDate = new Date('2020-01-01');

    await this.bookModel.findByIdAndUpdate(bookId, {
      $inc: { stock: -1 },
      startBorrow: Date.now(),
      endBorrow: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    await this.memberModel.findByIdAndUpdate(
      memberId,
      {
        $push: {
          books: bookId,
        },
        penalized: false,
        endPenalized: resetDate,
      },
      { new: true, userFindAndModify: false },
    );

    return this.memberModel.findById(memberId).populate('books');
  }

  // Post borrowed books to user
  async createReturnBooks(memberId, bookId, gotPenalized): Promise<Member> {
    const resetDate = new Date('2020-01-01');

    await this.bookModel.findByIdAndUpdate(bookId, {
      $inc: { stock: 1 },
      startBorrow: resetDate,
      endBorrow: resetDate,
    });

    await this.memberModel.findByIdAndUpdate(
      memberId,
      {
        $pull: {
          books: bookId,
        },
        penalized: gotPenalized,
        endPenalized: gotPenalized
          ? Date.now() + 3 * 24 * 60 * 60 * 1000
          : resetDate,
      },
      { new: true, userFindAndModify: false },
    );

    return this.memberModel.findById(memberId).populate('books');
  }
}
