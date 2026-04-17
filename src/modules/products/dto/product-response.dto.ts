import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'product ID',
    example: '3223543dae-dafsf22124',
  })
  id: string;

  @ApiProperty({
    description: 'product name',
    example: 'wireless Headphone',
  })
  name: string;

  @ApiProperty({
    description: 'product description',
    example: 'high quality wireless headphones',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'product price',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'product stock',
    example: 100,
  })
  stock: number;

  @ApiProperty({
    description: 'stock keeping unit',
    example: 'WH-001',
  })
  sku: string;

  @ApiProperty({
    description: 'product image url',
    example: 'fdasnfl',
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Product category',
    example: 'electronics',
  })
  category: string | null;

  @ApiProperty({
    description: 'product availability status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'update',
  })
  updatedAt: Date;
}
