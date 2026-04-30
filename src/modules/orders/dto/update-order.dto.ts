import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from './query-order.dto';
import { orderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(orderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
