import { orchidModel } from "../model/orchid.ts";

class OrchidRepository {
  async userGetAllOrchids() {
    const orchids = await orchidModel
      .find({}, "name image")
      .populate("Categories", "categoryName")

      .exec();
    return orchids;
  }
  async adminGetAllOrchids() {
    const orchids = await orchidModel
      .find()
      .populate("Categories")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "user", // Thay 'User' bằng tên của model người dùng trong ứng dụng của bạn
        },
      })
      .exec();
    return orchids;
  }
  async getOrchidsByCategory(categoryId: string) {
    const orchids = await orchidModel.find({ category: categoryId }).exec();
    return orchids;
  }
  async getOrchidById(orchidId: string) {
    const orchid = await orchidModel
      .findById(orchidId)
      .populate("Categories")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "user", // Thay 'User' bằng tên của model người dùng trong ứng dụng của bạn
        },
      })
      .exec();
    return orchid;
  }

  async createOrchid(orchidData: {
    name: string;
    image: string;
    isNatural: boolean;
    origin: string;
    category: string;
  }) {
    const newOrchid = await orchidModel.create(orchidData);
    return newOrchid;
  }

  async updateOrchid(
    orchidId: string,
    updateData: {
      name: string;
      image: string;
      isNatural: boolean;
      origin: string;
      category: string;
    }
  ) {
    const updatedOrchid = await orchidModel
      .findByIdAndUpdate(orchidId, updateData, { new: true })
      .populate("Categories")
      .exec();
    return updatedOrchid;
  }
  async searchOrchidByName(keyword: string) {
    const orchids = await orchidModel
      .find({ name: { $regex: keyword, $options: "i" } })
      .populate("Categories")
      .exec();
    return orchids;
  }

  async deleteOrchid(orchidId: string): Promise<boolean> {
    const result = await orchidModel.findByIdAndDelete(orchidId).exec();
    return result !== null;
  }
  async findOrchidByName(name: string) {
    const orchid = await orchidModel
      .find({ name })
      .populate("Categories")
      .exec();
    return orchid;
  }
}

export default OrchidRepository;
