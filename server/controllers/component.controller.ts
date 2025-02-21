import { NOT_FOUND, OK } from "@/constants/http";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import ComponentModel from "../models/component.model";
import { createComponentSchema } from "./component.schema";

export const upsertComponentHandler = catchErrors(async (req, res) => {
  const { _id, title, fields } = createComponentSchema.parse({
    ...req.body,
  });

  console.log(_id);
  // Create new or update existing post.
  // We need to find the entity by the id. The reason is that the id stays the same.
  // If we try to update the entity based on the slug or the name,
  // the user might update the category name, and the corresponding slug will also be updated.
  // Consequently, it will create a new entity in the DB instead of updating the existing one.
  let component;
  if (_id) {
    component = await ComponentModel.findOneAndUpdate(
      { _id },
      {
        title,
        fields,
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } else {
    component = await ComponentModel.create({
      title,
      fields,
    });
  }

  res.status(OK).json({
    component: { _id: component._id, title: component.title, fields: component.fields },
    message: "a component is succesfully created",
  });
});

export const getComponentsHandler = catchErrors(async (_req, res) => {
  const components = await ComponentModel.find({}).select(["_id", "title", "fields"]);
  res.status(OK).json(components);
});

export const getComponentByIdHandler = catchErrors(async (req, res) => {
  const component = await ComponentModel.findOne({ _id: req.params.componentId });
  appAssert(component, NOT_FOUND, "Component not found");

  res.status(OK).json({
    _id: component._id,
    title: component.title,
    fields: component.fields,
  });
});

export const deleteComponentById = catchErrors(async (req, res) => {
  const { id } = req.body;
  await ComponentModel.findByIdAndDelete({ _id: id });

  res.status(OK).json({
    message: "Component is successfully deleted",
  });
});
