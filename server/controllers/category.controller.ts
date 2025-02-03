import { NOT_FOUND, OK } from "../constants/http";
import catchErrors from "../utils/catchErrors";
import CategoryModel from "../models/category.model";
import { createCategorySchema } from "./category.schema";
import appAssert from "../utils/appAssert";

export const upsertCategoryHandler = catchErrors(async (req, res) => {
  const { _id, name, slug, description } = createCategorySchema.parse({
    ...req.body,
  });

  // Create new or update existing post.
  // We need to find the entity by the id. The reason is that the id stays the same.
  // If we try to update the entity based on the slug or the name,
  // the user might update the category name, and the corresponding slug will also be updated.
  // Consequently, it will create a new entity in the DB instead of updating the existing one.
  let category;
  if (_id) {
    category = await CategoryModel.findOneAndUpdate(
      { _id },
      {
        name,
        slug,
        description,
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } else {
    category = await CategoryModel.create({
      name,
      slug,
      description,
    });
  }

  res.status(OK).json({ category, message: "category is succesfully created" });
});

export const getCategoriesHandler = catchErrors(async (req, res) => {
  const categories = await CategoryModel.find({});
  res.status(OK).json(categories);
});

export const getSingleCategoryByIdHandler = catchErrors(async (req, res) => {
  const category = await CategoryModel.findOne({ _id: req.params.categoryId });
  appAssert(category, NOT_FOUND, "Category not found");

  res.status(OK).json({
    name: category.name,
    slug: category.slug,
    description: category.description,
  });
});
