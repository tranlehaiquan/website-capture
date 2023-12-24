import { FindOptionsWhere } from "typeorm";
import { Capture } from "../entity/Capture";

class CaptureServices {
  async create(capture: Capture) {
    return await capture.save();
  }

  async findWhere(where: FindOptionsWhere<Capture> | FindOptionsWhere<Capture>[] | undefined) {
    return await Capture.find({
      where
    });
  }

  async findByOwnerId(ownerId: string) {
    return await Capture.find({
      where: { ownerId },
    });
  }

  async getById(id: string) {
    return await Capture.findOne({
      where: { id },
    });
  }

  async update(id: string, capture: Capture) {
    return await Capture.update(id, capture);
  }

  async delete(id: string) {
    return await Capture.delete(id);
  }
}

export default CaptureServices;
