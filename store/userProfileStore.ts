import { UserProfile } from "@/lib/types";
import { create } from "zustand";

type UserProfileState = {
  userProfile: UserProfile;
};

type UserProfileAction = {
  setUserProfile: (value: UserProfile) => void;
};

export type UserProfileStore = UserProfileState & UserProfileAction;

const defaultInitState: UserProfileState = {
  userProfile: {
    name: "",
    username: "",
    biography: "",
    avatarUrl: "",
  },
};

export const initUserProfileStore = (): UserProfile => {
  return {
    name: "",
    username: "",
    biography: "",
    avatarUrl: "",
  };
};

export const useUserProfileStore = create<UserProfileStore>()((set) => ({
  ...defaultInitState,
  setUserProfile: (user) => set((state) => ({ userProfile: { ...state.userProfile, ...user } })),
}));
