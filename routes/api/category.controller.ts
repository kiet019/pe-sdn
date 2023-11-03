import { Router } from "express";
import { Category } from "../package/model/category.ts";
import CategoryRepository from "../package/repository/category.repository.ts";
import { UserRepository } from "../package/repository/user.repository.ts";

const categoryRouter = Router();

const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();

categoryRouter
  .get("/", async (req, res) => {
    try {
      const categories = await categoryRepository.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

  .get("/:categoryId", async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
      const category = await categoryRepository.getCategoryById(categoryId);
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

  .post("/", async (req, res) => {
    try {
      const user = await userRepository.getAuthorization(req);
      const categoryData: Category = req.body;
      const newCategory = await categoryRepository.createCategory(categoryData);
      res.json(newCategory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

  .put("/:categoryId", async (req, res) => {
    try {
      const user = await userRepository.getAuthorization(req);

      const categoryId = req.params.categoryId;

      const updateData: Category = req.body;
      const updatedCategory = await categoryRepository.updateCategory(
        categoryId,
        updateData
      );
      if (updatedCategory) {
        res.json(updatedCategory);
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })
  .delete("/:categoryId", async (req, res) => {
    try {
      const user = await userRepository.getAuthorization(req);

      const categoryId = req.params.categoryId;

      const deleted = await categoryRepository.deleteCategory(categoryId);
      if (deleted) {
        res.status(200).json({message: "Delete success"});
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

export default categoryRouter;
