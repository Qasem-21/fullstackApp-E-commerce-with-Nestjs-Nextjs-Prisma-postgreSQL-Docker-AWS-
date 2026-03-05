import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User Email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User Name',
    example: 'John Doe',
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    description: 'User Last Name',
    example: 'Doe',
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    description: 'User Role',
    example: 'USER',
  })
  @ApiProperty({
    description: 'User Role',
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    description: 'account Creation Date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'account Last Update Date',
    example: '2024-01-02T00:00:00.000Z',
  })
  updatedAt: Date;
}
