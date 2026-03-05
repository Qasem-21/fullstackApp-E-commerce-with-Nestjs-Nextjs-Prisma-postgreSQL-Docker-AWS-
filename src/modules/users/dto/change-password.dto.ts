import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'currentPassword@123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Current password should not be empty' })
  currentPassword: string;

  @ApiProperty({
    description: 'New password of the user',
    example: 'newPassword@456',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'New password should not be empty' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  newPassword: string;
}
