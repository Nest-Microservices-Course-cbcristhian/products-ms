import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data:createProductDto
    })
  }

  async findAll(paginationDto:PaginationDto) {

    const {page,limit}=paginationDto
    let totalPages= await this.product.count({where:{available:true}})
    totalPages=Math.ceil(totalPages/limit)

    return {
      data: await this.product.findMany({
        skip: (page-1)*limit,
        take:limit,
        where:{
          available:true
        }
      }),
      meta:{
        totalPages,
        page
      }
    }
  }

  async findOne(id: number) {
    const product= await this.product.findFirst({
      where:{id, available: true}
    })
    if(!product) throw new NotFoundException(`Product with id: ${id} not found`)
    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {

    const {id:_,...data}=updateProductDto
    
    return this.product.update({
      where:{id},
      data:data
    })
  }

  async remove(id: number) {
    await this.findOne(id)

    return this.product.update({
      where:{id},
      data:{available:false}
    })
  }
}
