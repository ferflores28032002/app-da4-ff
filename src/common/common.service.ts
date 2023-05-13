import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dtos/pagination.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {


    async findWithPagination(paginationDto: PaginationDto, repository: Repository<any>, where: any) {
        const { limit = 10, page = 1 } = paginationDto;

        const offset = (page - 1) * limit;

        const [results, total] = await Promise.all([
            repository.find({
                take: limit,
                skip: offset,
                where
            }),
            repository.count({ where })
        ]);

        const currentPage = page;
        const totalPages = Math.ceil(total / limit);

        return {
            results,
            pagination: {
                currentPage,
                totalPages,
                totalResults: total,
                resultsPerPage: limit
            }
        };
    }
}
