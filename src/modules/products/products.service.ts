import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product } from '@prisma/client';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  //   create a product
  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new ConflictException(
        `product with SKU ${createProductDto.sku} already exist`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        price: new Prisma.Decimal(createProductDto.price),
      },
      include: {
        category: true,
      },
    });

    return this.formatProduct(product);
  }

  // findAll
  async findAll(queryDto: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { category, isActive, search, page = 1, limit = 10 } = queryDto;
    // create an empty object
    // this object is used for data filtering from database
    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.categoryId = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.product.count({ where });

    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return {
      data: products.map((product) => this.formatProduct(product)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // get product By Id
  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException('product with this id is not found!');
    }
    return this.formatProduct(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException('product not found with this id');
    }

    if (updateProductDto && updateProductDto.sku !== existingProduct.sku) {
      const skuTaken = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });
      if (skuTaken) {
        throw new ConflictException(
          `product with ${updateProductDto.sku} already exist`,
        );
      }
    }

    // being careful about price
    const updateData: any = { ...updateProductDto };
    if (updateProductDto && updateProductDto.price !== undefined) {
      updateData.price = new Prisma.Decimal(updateProductDto.price);
    }

    const updateProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return this.formatProduct(updateProduct);
  }

  async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException('product not found with this ID');
    }

    const newStock = existingProduct.stock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
      include: {
        category: true,
      },
    });

    return this.formatProduct(updatedProduct);
  }

  async delete(id: string): Promise<{ message: string }> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItem: true,
        cartItem: true,
      },
    });
    if (!existingProduct) {
      throw new NotFoundException('product not found');
    }
    if (existingProduct.orderItem.length > 0) {
      throw new BadRequestException(
        'cannot delete product that is part of existing orders. Consider marking it as inactive only',
      );
    }
    await this.prisma.product.delete({
      where: { id },
    });
    return { message: 'product deleted successfully' };
  }
  private formatProduct(
    product: Product & { category: Category },
  ): ProductResponseDto {
    return {
      ...product,
      price: Number(product.price),
      category: product.category.name,
    };
  }
}
