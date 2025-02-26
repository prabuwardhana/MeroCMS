import { NOT_FOUND, OK } from "@/constants/http";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import PageWidgetModel from "../models/component.model";
import { createPageWidgetSchema } from "./component.schema";

export const upsertPageWidgetHandler = catchErrors(async (req, res) => {
  const { _id, title, fields } = createPageWidgetSchema.parse({
    ...req.body,
  });

  // Create new or update existing post.
  // We need to find the entity by the id. The reason is that the id stays the same.
  // If we try to update the entity based on the slug or the name,
  // the user might update the category name, and the corresponding slug will also be updated.
  // Consequently, it will create a new entity in the DB instead of updating the existing one.
  let pageWidget;
  if (_id) {
    pageWidget = await PageWidgetModel.findOneAndUpdate(
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
    pageWidget = await PageWidgetModel.create({
      title,
      fields,
    });
  }

  res.status(OK).json({
    pageWidget: { _id: pageWidget._id, title: pageWidget.title, fields: pageWidget.fields },
    message: "A page widget is succesfully created",
  });
});

export const getPageWidgetsHandler = catchErrors(async (_req, res) => {
  const pageWidgets = await PageWidgetModel.find({}).select(["_id", "title", "fields"]).sort({ createdAt: "desc" });
  res.status(OK).json(pageWidgets);
});

export const getPageWidgetByIdHandler = catchErrors(async (req, res) => {
  const pageWidget = await PageWidgetModel.findOne({ _id: req.params.pageWidgetId });
  appAssert(pageWidget, NOT_FOUND, "Page Widget not found");

  res.status(OK).json({
    _id: pageWidget._id,
    title: pageWidget.title,
    fields: pageWidget.fields,
  });
});

export const deletePageWidgetById = catchErrors(async (req, res) => {
  const { id } = req.body;
  await PageWidgetModel.findByIdAndDelete({ _id: id });

  res.status(OK).json({
    message: "Page Widget is successfully deleted",
  });
});
