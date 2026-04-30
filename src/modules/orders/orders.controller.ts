import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import {
  ModerateThrottle,
  RelaxedThrottle,
} from 'src/common/decorators/custom-throttler.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderApiResponseDto,
  OrderResponseDto,
  PaginatedOrderResponseDto,
} from './dto/order-response.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //   create orders
  @Post()
  @ModerateThrottle()
  @ApiOperation({
    summary: 'create a new order',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiCreatedResponse({
    description: 'order created successfully',
    type: OrderApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'invalid data or insufficient stock',
  })
  @ApiNotFoundResponse({
    description: 'can not found or empty',
  })
  @ApiTooManyRequestsResponse({
    description: 'too many requests - rate limit exceed',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.create(userId, createOrderDto);
  }

  // get all orders
  @Get('admin/all')
  @Roles(Role.ADMIN)
  @RelaxedThrottle()
  @ApiOperation({
    summary: '[ADMIN] Get all orders (paginated)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    description: 'List of order',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(OrderResponseDto) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'admin access required',
  })
  async findAllForAdmin(@Query() queryOrderDto: QueryOrderDto): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return await this.ordersService.findAllForAdmin(queryOrderDto);
  }

  // user Get own orders
  @Get()
  @RelaxedThrottle()
  @ApiOperation({
    summary: 'get all orders for current user (paginated)',
  })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'List of user orders',
    type: PaginatedOrderResponseDto,
  })
  async findAll(@Query() query: QueryOrderDto, @GetUser('id') userId: string) {
    return await this.ordersService.findAll(userId, query);
  }

  // ADMIN: Get order by id
  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @RelaxedThrottle()
  @ApiOperation({
    summary: '[ADMIN]: get order by id',
  })
  @ApiParam({
    name: 'id',
    description: 'order id',
  })
  @ApiOkResponse({
    description: 'order details',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'order not found',
  })
  @ApiForbiddenResponse({
    description: 'admin access required',
  })
  async findOneAdmin(@Param('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  // USER: get own order by id
  @Get('id')
  @RelaxedThrottle()
  @ApiOperation({
    summary: 'get an order by ID for current user',
  })
  @ApiParam({
    name: 'id',
    description: 'order ID',
  })
  @ApiOkResponse({
    description: 'order detail',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'order not found',
  })
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return await this.ordersService.findOne(id, userId);
  }

  // admin update order
  @Patch('admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  @ApiOperation({
    summary: '[ADMIN] update any order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiBody({
    type: UpdateOrderDto,
  })
  @ApiOkResponse({
    description: 'order update successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'order not found',
  })
  @ApiForbiddenResponse({
    description: 'admin access required',
  })
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return await this.ordersService.update(id, dto);
  }

  // user: update own order
  @Patch(':id')
  @ModerateThrottle()
  @ApiOperation({
    summary: 'update your own order',
  })
  @ApiParam({
    name: 'id',
    description: 'order id',
  })
  @ApiBody({
    type: UpdateOrderDto,
  })
  @ApiOkResponse({
    description: 'order updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'order not found',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.update(id, dto, userId);
  }

  // ADMIN: cancel an order
  @Delete('admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  @ApiOperation({
    summary: 'ADMIN cancel order by id',
  })
  @ApiParam({
    name: 'id',
    description: 'order id',
  })
  @ApiOkResponse({
    description: 'order canceled',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'order not found',
  })
  async cancelAdmin(@Param('id') id: string) {
    return await this.ordersService.cancel(id);
  }

  // USER: cancel own order
  @Delete(':id')
  @ModerateThrottle()
  @ApiOperation({
    summary: 'USER cancel order by id',
  })
  @ApiParam({
    name: 'id',
    description: 'order id',
  })
  @ApiOkResponse({
    description: 'order canceled',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'order not found',
  })
  async cancel(@Param('id') id: string, @GetUser('id') userId: string) {
    return await this.ordersService.cancel(id, userId);
  }
}
