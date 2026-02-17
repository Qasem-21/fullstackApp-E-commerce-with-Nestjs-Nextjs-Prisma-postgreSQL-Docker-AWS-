import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
// import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
