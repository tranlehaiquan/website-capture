import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import CapturesRepo from "../repositories/captures.repo";
import { CreateCapture } from "./captures.dto";
import { ApiTags } from '@nestjs/swagger';

@ApiTags('captures')
@Controller('captures')
class CapturesController {
  constructor(
    private readonly capturesRepo: CapturesRepo
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
    return this.capturesRepo.create(newCapture);
  }
}

export default CapturesController;