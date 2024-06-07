import React from "react";
import _ from "lodash";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export const numberWithCommas = (x: number) => {
  // if (x - Math.floor(Number(x)) === 0) {
  //     x = Number(x).toFixed(0)
  // }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const dynamicSortWithMany = (
  properties: string[],
  order: "asc" | "desc" = "asc"
) => {
  const sortOrder = order === "desc" ? -1 : 1;
  return (a: any, b: any) => {
    let result = 0;
    properties.forEach((property) => {
      if (result === 0) {
        result =
          _.get(a, property) < _.get(b, property)
            ? -1
            : _.get(a, property) > _.get(b, property)
            ? 1
            : 0;
      }
    });
    return result * sortOrder;
  };
};

export const getLogo = (link: string) => {
  const websiteList = [
    "https://www.coursera.org/",
    "https://www.udemy.com/",
    "https://www.edx.org/",
  ];

  if (link.includes(websiteList[0])) {
    return "https://149357281.v2.pressablecdn.com/wp-content/uploads/2020/12/android-chrome-512x512-1.png";
  } else if (link.includes(websiteList[1])) {
    return "https://logos-world.net/wp-content/uploads/2021/11/Udemy-Logo.png";
  } else if (link.includes(websiteList[2])) {
    return "https://www.edx.org/images/logos/edx-logo-elm.svg";
  } else {
    return "";
  }
};
export const getLargeLogo = (link: string) => {
  const websiteList = [
    "https://www.coursera.org/",
    "https://www.udemy.com/",
    "https://www.edx.org/",
  ];

  if (link.includes(websiteList[0])) {
    return "https://images.ctfassets.net/00atxywtfxvd/2MlqAOzmHjSPtssv6HlNox/1cb35b40775835a5f574ebc5509907a1/coursera-wordmark-blue.svg";
  } else if (link.includes(websiteList[1])) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/2560px-Udemy_logo.svg.png";
  } else if (link.includes(websiteList[2])) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/EdX.svg/1200px-EdX.svg.png";
  } else {
    return "";
  }
};

export const getColorByURL = (link: string) => {
  return "primary.main";
  const websiteList = [
    "https://www.coursera.org/",
    "https://www.udemy.com/",
    "https://www.edx.org/",
  ];

  if (link.includes(websiteList[0])) {
    return "#0056d2";
  } else if (link.includes(websiteList[1])) {
    return "#be32f5";
  } else if (link.includes(websiteList[2])) {
    return "#02262b";
  } else {
    return "primary.main";
  }
};

export const openOnNewTab = (url: string) => {
  window.open(url, "_blank");
};

export const isNumeric = (maybeNumber: any): boolean => {
  if (!maybeNumber) {
    return false;
  }
  return !isNaN(+maybeNumber);
};
