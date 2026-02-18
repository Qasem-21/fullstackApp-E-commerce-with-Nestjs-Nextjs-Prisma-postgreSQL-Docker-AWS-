import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
// import { PrismaService } from './prisma.service';
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
