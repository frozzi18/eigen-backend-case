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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BookService } from 'src/books/book.service';
import { Member } from './member.schema';
import { MemberService } from './member.service';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly bookService: BookService,
  ) {}

  @Post()
  @ApiBody({
    type: Member,
    description: 'The Description for the Post Body  for Member.',
    examples: {
      a: {
        summary: 'Empty Body',
        description: 'Description for when an empty body is used',
        value: {} as Member,
      },
      b: {
        summary: 'Member Body Without Books',
        description: 'Member Body Example',
        value: {
          code: 'M001',
          name: 'Angga',
          books: [],
        } as unknown as Member,
      },
      c: {
        summary: 'Member Body 1 Book',
        description: 'Member Body Example',
        value: {
          code: 'M001',
          name: 'Angga',
          books: ['61b91410c3f2a050d46bbcd0'],
        } as unknown as Member,
      },
      d: {
        summary: 'Member Body 2 Books',
        description: 'Member Body Example',
        value: {
          code: 'M001',
          name: 'Angga',
          books: ['61b91410c3f2a050d46bbcd0', '61b9146ec3f2a050d46bbcd1'],
        } as unknown as Member,
      },
    },
  })
  async createMember(@Res() response, @Body() member: Member) {
    const newMember = await this.memberService.create(member);
    return response.status(HttpStatus.CREATED).json({
      newMember,
    });
  }

  @Get()
  async fetchAll(@Res() response) {
    const members = await this.memberService.readAll();
    return response.status(HttpStatus.OK).json({
      members,
    });
  }

  @Get('/bookscount')
  async fetchAllBooksCount(@Res() response) {
    const members = await this.memberService.readAll();
    const membersBooksCount = members.map((member) => {
      const memberModified = {
        name: member.name,
        borrowedBookCount: member.books.length,
      };

      return memberModified;
    });

    return response.status(HttpStatus.OK).json({
      membersBooksCount,
    });
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async findById(@Res() response, @Param('id') id) {
    const member = await this.memberService.readById(id);
    return response.status(HttpStatus.OK).json({
      member,
    });
  }

  @Put('/:id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiBody({
    type: Member,
    description: 'The Description for the Post Body  for Member.',
    examples: {
      a: {
        summary: 'Empty Body',
        description: 'Description for when an empty body is used',
        value: {} as Member,
      },
      b: {
        summary: 'Member Body',
        description: 'Member Body Example',
        value: {
          code: 'M001',
          name: 'Angga',
          books: ['61b91410c3f2a050d46bbcd0'],
          endPenalized: '2020-01-01T00:00:00.000Z',
          penalized: false,
        } as unknown as Member,
      },
    },
  })
  async update(@Res() response, @Param('id') id, @Body() member: Member) {
    const updatedMember = await this.memberService.update(id, member);
    return response.status(HttpStatus.OK).json({
      updatedMember,
    });
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async delete(@Res() response, @Param('id') id) {
    const deletedMember = await this.memberService.delete(id);
    return response.status(HttpStatus.OK).json({
      deletedMember,
    });
  }

  // Borrow Books API
  @Put('/:memberId/:bookId')
  @ApiParam({ name: 'memberId', type: 'string', required: true })
  @ApiParam({ name: 'bookId', type: 'string', required: true })
  async updateMemberBorrowBook(
    @Res() response,
    @Param('memberId') memberId,
    @Param('bookId') bookId,
  ) {
    const bookToBorrow = await this.bookService.readById(bookId);
    const memberWhoBorrow = await this.memberService.readById(memberId);
    const currentDate = new Date().getTime();

    if (
      memberWhoBorrow.penalized &&
      memberWhoBorrow.endPenalized.getTime() > currentDate
    ) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Member is currently being penalized',
      });
    }

    if (memberWhoBorrow.books.length >= 2) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Members may not borrow more than 2 books',
      });
    }

    if (bookToBorrow.stock == 0) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Book is not available',
      });
    }

    const updatedMember = await this.memberService.createBorrowBooks(
      memberId,
      bookId,
    );
    return response.status(HttpStatus.OK).json({
      updatedMember,
    });
  }

  // Return Books API
  @Put('/:memberId/:bookId/return')
  @ApiParam({ name: 'memberId', type: 'string', required: true })
  @ApiParam({ name: 'bookId', type: 'string', required: true })
  // @ApiCreatedResponse({
  //   description:
  //     'This description defines when a 201 (Created) is returned. For @Post-Annotated Endpoints this is always present. When, for example, using a @Get-Endpoint, a 200 OK is always present instead.',
  //   schema: {
  //     type: 'string',
  //     examples: { example: 'hello', messages: 'Books not available' },

  //     // For instructions on how to set a Schema, please refer to https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schema-object-examples
  //   },
  // })
  async updateMemberReturnBook(
    @Res() response,
    @Param('memberId') memberId,
    @Param('bookId') bookId,
  ) {
    const bookToReturn = await this.bookService.readById(bookId);
    const memberWhoReturn = await this.memberService.readById(memberId);

    let gotPenalized = false;

    const currentDate = new Date().getTime();

    if (!memberWhoReturn.books.includes(bookId)) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Member has not borrowed the book',
      });
    }

    if (currentDate > bookToReturn.endBorrow.getTime()) {
      gotPenalized = true;
    }

    const updatedMember = await this.memberService.createReturnBooks(
      memberId,
      bookId,
      gotPenalized,
    );
    return response.status(HttpStatus.OK).json({
      updatedMember,
    });
  }
}
