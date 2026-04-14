import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the category',
  })
  id: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  name: string;

  @ApiProperty({
    example: 'what is your name',
    description: 'hi how are you',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'electronics',
    description: 'The URL-friendly slug for the category',
    nullable: true,
  })
  slug: string | null;

  @ApiProperty({
    example: 'https://example.com',
    description: 'URL of the category image',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    example: true,
    description: 'Indicates if the category is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: '150',
    description: 'The number of products in the category',
  })
  productCount: number;

  @ApiProperty({
    example: '2024-06-01T12:00:00Z',
    description: 'The date and time when the category was created',
  })
  createAt: Date;

  @ApiProperty({
    example: '2024-06-10T15:30:00Z',
    description: 'The date and time when the category was last updated',
  })
  updateAt: Date;
}
