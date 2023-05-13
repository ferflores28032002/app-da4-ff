import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
    private readonly paginate: CommonService

  ) { }


  async create(createProductDto: CreateProductDto) {
    const { name } = createProductDto;

    try {
      const existingProduct = await this.ProductRepository.findOne({ where: { name } });

      if (existingProduct && !existingProduct.isActive) {
        throw new ConflictException(`Product with name ${name} already exists and is inactive`);
      }

      const product = this.ProductRepository.create(createProductDto);

      const savedProduct = await this.ProductRepository.save(product);

      return savedProduct;
    } catch (error) {
      this.DatabaseErrorHandler(error);
    }
  }


  async findAll(paginationDto: PaginationDto) {

    try {
      const results = await this.paginate.findWithPagination(paginationDto, this.ProductRepository, { isActive: true });
      return results

    } catch (error) {
      this.DatabaseErrorHandler(error)
    }

  }


  async findOne(id: string) {

    const product = await this.ProductRepository.findOneBy({ id, isActive: true })

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found!`)

    return product
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.ProductRepository.preload({ id, ...updateProductDto })

    if (!product) throw new NotFoundException(`Product whith id ${id} not found!`)
    await this.ProductRepository.save(product)

    return product
  }



  async remove(id: string) {

    const product = this.findOne(id);

    (await product).isActive = false
    this.ProductRepository.save((await product))

    return {
      msg: 'Product deleted successfully!'
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
