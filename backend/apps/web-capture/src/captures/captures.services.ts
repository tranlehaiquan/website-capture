import { Injectable } from '@nestjs/common';
import CapturesRepo, { CaptureStatus } from '../repositories/captures.repo';
import { CreateCapture } from './captures.dto';
import { MessageQueueService } from '@app/message-queue';
import { first } from 'lodash';
@Injectable()
class CapturesServices {
  constructor(
    private readonly capturesRepo: CapturesRepo,
    private readonly sqsService: MessageQueueService,
  ) {}

  async createCapture(newCapture: CreateCapture) {
    const capture = await this.capturesRepo.create({
      ...newCapture,
      status: CaptureStatus.PENDING,
    });

    await this.sqsService.sendMessage({
      captureId: first(capture).id,
    });

    return first(capture);
  }
}

export default CapturesServices;
