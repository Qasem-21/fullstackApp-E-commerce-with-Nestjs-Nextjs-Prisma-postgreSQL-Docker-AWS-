import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

//  DTO for creating a new product
export class CreateProductDto {
  @ApiProperty({
    description: 'product name',
    example: 'wireless headphones',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'product description',
    example: 'High-quality wireless',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'product price in USD',
    example: 99.99,
    minimum: 0,
  })
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({
    description: 'stock keeping unit sku - unique identifier',
    example: 'WH-001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: 'product image url',
    example: 'imageUrl',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'product category',
    example: 'electronics',
    required: true,
  })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({
    description: 'whether product is active and available for purchase',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
