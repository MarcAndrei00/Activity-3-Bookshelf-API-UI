import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private repo: Repository<Book>,
  ) {}

  create(createDto: CreateBookDto) {
    const book = this.repo.create(createDto);
    return this.repo.save(book);
  }

  findAll() {
    return this.repo.find({ order: { title: 'ASC' } });
  }

  async findOne(id: string) {
    const book = await this.repo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, updateDto: UpdateBookDto) {
    await this.repo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Book not found');
    return { deleted: true };
  }
}
