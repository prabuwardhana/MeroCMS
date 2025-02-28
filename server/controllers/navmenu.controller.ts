import { NOT_FOUND, OK } from "@/constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import NavMenuModel from "../models/navmenu.model";
import { createNavMenuSchema } from "./navmenu.schema";

export const upsertNavMenuHandler = catchErrors(async (req, res) => {
  const { _id, title, navItems } = createNavMenuSchema.parse({
    ...req.body,
  });

  // create new or update existing nav menu
  let navMenu;
  if (_id) {
    navMenu = await NavMenuModel.findOneAndUpdate(
      { _id },
      {
        title,
        navItems,
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } else {
    navMenu = await NavMenuModel.create({
      title,
      navItems,
    });
  }

  res.status(OK).json({ navMenu, message: "nav-menu succesfully created" });
});

export const getNavMenusHandler = catchErrors(async (req, res) => {
  const navMenus = await NavMenuModel.find({}).sort({ createdAt: "desc" }).exec();
  res.status(OK).json(navMenus);
});

export const getNavMenuByIdHandler = catchErrors(async (req, res) => {
  const navMenu = await NavMenuModel.findOne({ _id: req.params.navId });
  appAssert(navMenu, NOT_FOUND, "Nav menu not found");

  res.status(OK).json(navMenu);
});

export const getNavMenuByTitleHandler = catchErrors(async (req, res) => {
  const navMenu = await NavMenuModel.findOne({ title: req.params.title });
  appAssert(navMenu, NOT_FOUND, "Nav menu not found");

  res.status(OK).json(navMenu);
});

export const deleteNavMenuById = catchErrors(async (req, res) => {
  const { id } = req.body;
  await NavMenuModel.findByIdAndDelete({ _id: id });

  res.status(OK).json({
    message: "Nav menu is successfully deleted",
  });
});
