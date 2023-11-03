import { Category, categoryModel } from "../model/category.ts";

class CategoryRepository {
  async getAllCategories() {
    return await categoryModel.find().exec();
  }
  async getCategoryByName(categoryName: string) {
    return await categoryModel.find({categoryName})
  }
  async getCategoryById(categoryId: string) {
    return await categoryModel.findById(categoryId).exec();
  }

  async createCategory(categoryData: Category) {
    if (categoryData.categoryName.length === 0) {
      throw new Error("Category name is not empty");
    }
    return await categoryModel.create({
      categoryName: categoryData.categoryName,
    });
  }

  async updateCategory(categoryId: string, updateData: Partial<Category>) {
    return await categoryModel
      .findByIdAndUpdate(categoryId, updateData, { new: true })
      .exec();
  }

  async deleteCategory(categoryId: string) {
    const result = await categoryModel.findByIdAndDelete(categoryId).exec();
    return result !== null;
  }
}

export default CategoryRepository;
