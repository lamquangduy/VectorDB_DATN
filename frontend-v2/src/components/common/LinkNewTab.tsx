import { Tooltip } from "@mui/material";
import React from "react";
interface LinkNewTabProps {
  href: string;
  children?: React.ReactNode;
  title?: string;
}
const LinkNewTab: React.FC<LinkNewTabProps> = ({
  href,
  children = undefined,
  title = "",
}): JSX.Element => {
  const openNewTab = (link: string) => {
    window.open(link);
  };
  return (
    <Tooltip title={title} placement="top" arrow sx={{ width: "100%" }}>
      <a
        href={href}
        onClick={(e) => {
          openNewTab(href);
          e.preventDefault();
        }}
        style={{
          color: "inherit",
          fontWeight: "inherit",
          fontFamily: "inherit",
          textDecoration: "inherit",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical",
        }}
      >
        {children || ""}
      </a>
    </Tooltip>
  );
};
export default LinkNewTab;
