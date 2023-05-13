import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CommonService } from 'src/common/common.service';
import { hashSync, compareSync } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    private readonly paginate: CommonService,
    private readonly jwtService: JwtService,
  ) { }


  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    try {
      const existingUser = await this.UserRepository.findOne({ where: { email } });

      if (existingUser && !existingUser.isActive) {
        throw new ConflictException(`User with email ${email} already exists and is inactive`);
      }

      const user = this.UserRepository.create(createUserDto);
      const passHash = hashSync(createUserDto.password);

      const savedUser = await this.UserRepository.save({
        ...user,
        password: passHash
      });

      return savedUser;
    } catch (error) {
      this.DatabaseErrorHandler(error);
    }
  }

  async login(loginDto: LoginDto) {

    const { email, password } = loginDto

    const user = await this.UserRepository.findOne({ where: { email } });

    if (!user || (!compareSync(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload, { secret: process.env.JWT_SECRECT });

    return {
      user,
      token
    }
  }


  async findAll(paginationDto: PaginationDto) {
    try {
      const results = await this.paginate.findWithPagination(paginationDto, this.UserRepository, { isActive: true });
      return results

    } catch (error) {
      this.DatabaseErrorHandler(error)
    }
  }


  async findOne(id: string) {

    const user = await this.UserRepository.findOneBy({ id, isActive: true })

    if (!user)
      throw new NotFoundException(`User with id ${id} not found!`)

    return user
  }


  async update(id: string, updateUserDto: CreateUserDto) {

    const user = this.findOne(id)

    const isPasswordCorrect = compareSync(updateUserDto.password, (await user).password)

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid password');
    }

    ((await user).email) = updateUserDto.email;

    return {
      msg: 'User updated successfully',
      user: await this.UserRepository.save((await user))
    }

  }


  async remove(id: string) {

    const user = this.findOne(id);

    (await user).isActive = false
    this.UserRepository.save((await user))

    return {
      msg: 'User deleted successfully!'
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
