import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly CategoryRepository: Repository<Category>,
    private readonly paginate: CommonService
  ) { }


  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    try {
      const existingCategory = await this.CategoryRepository.findOne({ where: { name } });

      if (existingCategory && !existingCategory.isActive) {
        throw new ConflictException(`Category with name ${name} already exists and is inactive`);
      }

      const category = this.CategoryRepository.create(createCategoryDto);

      const savedCategory = await this.CategoryRepository.save(category);

      return savedCategory;
    } catch (error) {
      this.DatabaseErrorHandler(error);
    }
  }


  async findAll(paginationDto: PaginationDto) {
    try {
      const results = await this.paginate.findWithPagination(paginationDto, this.CategoryRepository, { isActive: true });
      return results

    } catch (error) {
      this.DatabaseErrorHandler(error)
    }
  }


  async findOne(id: string) {

    const category = await this.CategoryRepository.findOneBy({ id, isActive: true })

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found!`)

    return category
  }


  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    const category = await this.CategoryRepository.preload({ id, ...updateCategoryDto })

    if (!category) throw new NotFoundException(`Category whith id ${id} not found!`)
    await this.CategoryRepository.save(category)

    return category
  }


  async remove(id: string) {

    const category = this.findOne(id);

    (await category).isActive = false
    this.CategoryRepository.save((await category))

    return {
      msg: 'Category deleted successfully!'
    }
  }


  DatabaseErrorHandler(error: any) {
    // Si es un error de llave duplicada, lanzamos el ConflictException correspondiente.
    if (error.code === '23505') {
      throw new ConflictException(error.detail);
    } else if (error instanceof ConflictException) {
      throw error; // Si la excepción es de tipo ConflictException, la lanzamos tal cual
    } else {
      throw new BadRequestException()
    }
  }
}
