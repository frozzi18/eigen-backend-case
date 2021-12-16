import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/books/book.schema';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(book: Book): Promise<Book> {
    const newBook = new this.bookModel(book);
    return newBook.save();
  }

  async readAll(): Promise<Book[]> {
    return await this.bookModel.find().exec();
  }

  async readAllNotBorrowed(): Promise<Book[]> {
    return await this.bookModel.find({ stock: { $gt: 0 } }).exec();
  }

  async readById(id): Promise<Book> {
    return await this.bookModel.findById(id).exec();
  }

  async update(id, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, { new: true });
  }

  async delete(id): Promise<any> {
    return await this.bookModel.findByIdAndRemove(id);
  }
}
