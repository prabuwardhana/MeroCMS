import { NOT_FOUND, OK } from "../constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { createNavMenuSchema } from "./navmenu.schema";
import NavMenuModel from "../models/navmenu.model";

export const upsertNavMenuHandler = catchErrors(async (req, res) => {
  const { _id, title, navMenuContent } = createNavMenuSchema.parse({
    ...req.body,
  });

  console.log(navMenuContent);

  // create new or update existing nav menu
  let navMenu;
  if (_id) {
    navMenu = await NavMenuModel.findOneAndUpdate(
      { _id },
      {
        title,
        navMenuContent,
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } else {
    navMenu = await NavMenuModel.create({
      title,
      navMenuContent,
    });
  }

  res.status(OK).json({ navMenu, message: "nav-menu succesfully created" });
});

export const getSingleNavMenuByIdHandler = catchErrors(async (req, res) => {
  const navMenu = await NavMenuModel.findOne({ _id: req.params.postId });
  appAssert(navMenu, NOT_FOUND, "Nav menu not found");

  res.status(OK).json(navMenu);
});

export const getNavMenusHandler = catchErrors(async (req, res) => {
  const navMenus = await NavMenuModel.find({}).sort({ createdAt: "desc" }).exec();
  res.status(OK).json(navMenus);
});

export const deleteNavMenuById = catchErrors(async (req, res) => {
  const { id } = req.body;
  await NavMenuModel.findByIdAndDelete({ _id: id });

  res.status(OK).json({
    message: "Nav menu is successfully deleted",
  });
});
