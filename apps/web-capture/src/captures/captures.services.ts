import { Injectable } from "@nestjs/common";
import CapturesRepo, { CaptureStatus } from "../repositories/captures.repo";
import { CreateCapture } from "./captures.dto";

@Injectable()
class CapturesServices {
  constructor(private readonly capturesRepo: CapturesRepo) {}

  async createCapture(newCapture: CreateCapture) {
    return this.capturesRepo.create({
      ...newCapture,
      status: CaptureStatus.PENDING,
    });
  }
}

export default CapturesServices;