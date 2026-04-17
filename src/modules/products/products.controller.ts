import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // create
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiBearerAuth('JWT_auth')
  @ApiOperation({
    summary: 'create a new product admin only',
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @ApiResponse({
    status: 201,
    description: 'product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'sku already exists',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.create(createProductDto);
  }

  // get all products
  @Get()
  @ApiOperation({
    summary: 'get all products with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'list of products with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductResponseDto' },
        },

        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(@Query() queryDto: QueryProductDto) {
    return await this.productsService.findAll(queryDto);
  }

  // get product by ID
  @Get(':id')
  @ApiOperation({
    summary: 'get product by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'product details',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'product not found',
  })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return await this.productsService.findOne(id);
  }

  // update product
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'update product only Admin' })
  @ApiBody({
    type: UpdateProductDto,
  })
  @ApiResponse({
    status: 200,
    description: 'product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'product not found',
  })
  @ApiResponse({
    status: 409,
    description: 'sku already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.update(id, updateProductDto);
  }

  // update product stock
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'update product stock (Admin only)',
  })
  @ApiBody({
    // instead of DTO
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description:
            'stock adjustment (positive to add, negative to subtract)',
          example: 10,
        },
      },
      required: ['quantity'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'stock updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient stock',
  })
  @ApiResponse({
    status: 404,
    description: 'product not found',
  })
  async updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateStock(id, quantity);
  }

  // delete a product
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'delete product (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Product delelted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'cannot delete product in active orders',
  })
  @ApiResponse({
    status: 404,
    description: 'product not found',
  })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return await this.productsService.delete(id);
  }
}
