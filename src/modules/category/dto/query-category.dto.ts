import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class QueryCategoryDto {
  @ApiPropertyOptional({
    description: 'Filter categories by active status',
    example: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Search categories by name or description',
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @IsNumber()
  page = 1;

  @ApiPropertyOptional({
    description: 'Number of categories per page',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @IsNumber()
  limit: 10;
}
