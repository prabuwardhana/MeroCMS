import React from "react";
import { type IconType } from "react-icons";

import { FaXTwitter, FaSquareFacebook, FaSquareInstagram, FaTiktok, FaLinkedin } from "react-icons/fa6";

const socialIcons: Record<string, IconType> = {
  twitter: FaXTwitter,
  facebook: FaSquareFacebook,
  instagram: FaSquareInstagram,
  tiktok: FaTiktok,
  linkedin: FaLinkedin,
};

interface SocialIconProps {
  name: string;
  size?: string;
}

const SocialIcon = ({ name, size, ...rest }: SocialIconProps) =>
  React.createElement(socialIcons[name], { style: { fontSize: `${size ? size + "px" : "16px"}`, ...rest } });
export default SocialIcon;
