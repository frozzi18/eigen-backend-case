import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Book } from 'src/books/book.schema';
import { BookService } from 'src/books/book.service';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiBody({
    type: Book,
    description: 'The Description for the Post Body  for Book',
    examples: {
      a: {
        summary: 'Empty Body',
        description: 'Description for when an empty body is used',
        value: {} as Book,
      },
      b: {
        summary: 'Book Body',
        description: 'Book body example',
        value: {
          code: 'HOB-83',
          title: 'The Hobbit, or There and Back Again',
          author: 'J.R.R. Tolkien',
          stock: 1,
        } as unknown as Book,
      },
    },
  })
  async createBook(@Res() response, @Body() book: Book) {
    const newBook = await this.bookService.create(book);
    return response.status(HttpStatus.CREATED).json({
      newBook,
    });
  }

  @Get()
  async fetchAll(@Res() response) {
    const books = await this.bookService.readAll();
    return response.status(HttpStatus.OK).json({
      books,
    });
  }

  @Get('/available')
  async fetchAllNotBorrowed(@Res() response) {
    const books = await this.bookService.readAllNotBorrowed();
    return response.status(HttpStatus.OK).json({
      books,
    });
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async findById(@Res() response, @Param('id') id) {
    const book = await this.bookService.readById(id);
    return response.status(HttpStatus.OK).json({
      book,
    });
  }

  @Put('/:id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiBody({
    type: Book,
    description: 'The Description for the Post Body  for Book',
    examples: {
      a: {
        summary: 'Empty Body',
        description: 'Description for when an empty body is used',
        value: {} as Book,
      },
      b: {
        summary: 'Book Body',
        description: 'Book body example',
        value: {
          code: 'HOB-83',
          title: 'The Hobbit, or There and Back Again',
          author: 'J.R.R. Tolkien',
          stock: 1,
        } as unknown as Book,
      },
    },
  })
  async update(@Res() response, @Param('id') id, @Body() book: Book) {
    const updatedBook = await this.bookService.update(id, book);
    return response.status(HttpStatus.OK).json({
      updatedBook,
    });
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async delete(@Res() response, @Param('id') id) {
    const deletedBook = await this.bookService.delete(id);
    return response.status(HttpStatus.OK).json({
      deletedBook,
    });
  }
}
