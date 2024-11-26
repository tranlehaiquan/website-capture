import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import CapturesRepo from '../repositories/captures.repo';
import { CreateCapture } from './captures.dto';
import { ApiTags } from '@nestjs/swagger';
import CapturesServices from './captures.services';
import { MessageQueueService } from '@app/message-queue';

@ApiTags('captures')
@Controller('captures')
class CapturesController {
  constructor(
    private readonly capturesRepo: CapturesRepo,
    private readonly captureServices: CapturesServices,
    private readonly sqsService: MessageQueueService,
  ) {}

  // get all
  @Get()
  async findAllCaptures() {
    return this.capturesRepo.findAll();
  }

  // get by id
  @Get(':id')
  async findCaptureById(@Param('id') id: string) {
    return this.capturesRepo.findOneById(id);
  }

  @Post()
  async createCapture(@Body() newCapture: CreateCapture) {
    return this.captureServices.createCapture(newCapture);
  }
}

export default CapturesController;
