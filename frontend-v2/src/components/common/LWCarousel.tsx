import { NextIconCustom } from "@components/icons/nextIcon";
import { PreviousIconCustom } from "@components/icons/previousIcon";
import { translate } from "@constants/lang";
import useCustomMediaQuery from "@hooks/useCustomMediaQuery";
import { Box, Button } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import React from "react";
import { Carousel } from "react-responsive-carousel";
interface CustomCarouselProps {
  children: JSX.Element[] | undefined;
  numberElementDisplay?: number;
  onLastElement?: () => void;
  infiniteLoop?: boolean;
  showIndicators?: boolean;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  children,
  numberElementDisplay = 1,
  onLastElement = () => {},
  infiniteLoop = false,
  showIndicators = false,
}) => {
  const language = useAppSelector((state) => state.lang.langKey);
  const useMediaQuery = useCustomMediaQuery();
  const childrenGroupArray: JSX.Element[][] = [];
  let buffer: JSX.Element[] = [];
  if (children) {
    if (useMediaQuery.isMobile) {
      children.forEach((item: JSX.Element) => {
        if (buffer.length < 1) {
          buffer.push(item);
        } else {
          childrenGroupArray.push(buffer);
          buffer = [];
          buffer.push(item);
        }
      });
    } else {
      children.forEach((item: JSX.Element) => {
        if (buffer.length < numberElementDisplay) {
          buffer.push(item);
        } else {
          childrenGroupArray.push(buffer);
          buffer = [];
          buffer.push(item);
        }
      });
    }
    if (buffer.length > 0) {
      childrenGroupArray.push(buffer);
      buffer = [];
    }
  }
  return (
    <Carousel
      width={"100%"}
      showArrows={true}
      showIndicators={showIndicators}
      infiniteLoop={infiniteLoop}
      showStatus={false}
      showThumbs={false}
      renderArrowPrev={(clickHandler: () => void, hasPrev: boolean) => {
        return (
          <Button
            onClick={() => {
              if (hasPrev) {
                clickHandler();
              }
            }}
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              opacity: !hasPrev ? 0.2 : 1,
              border: useMediaQuery.isMobile ? "none" : "inherit",
              minWidth: useMediaQuery.isMobile ? 32 : 64,
              width: useMediaQuery.isMobile ? 32 : "auto",
            }}
            disabled={!hasPrev}
            variant="outlined"
          >
            <PreviousIconCustom
              background="transparent"
              width={25}
              height={25}
            ></PreviousIconCustom>
          </Button>
        );
      }}
      renderArrowNext={(clickHandler: () => void, hasNext: boolean) => {
        return (
          <Button
            onClick={() => {
              if (hasNext) {
                clickHandler();
              } else onLastElement();
            }}
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              opacity: !hasNext ? 0.2 : 1,
              border: useMediaQuery.isMobile ? "none" : "inherit",
              minWidth: useMediaQuery.isMobile ? 32 : 64,
              width: useMediaQuery.isMobile ? 32 : "auto",
            }}
            disabled={!hasNext}
            variant="outlined"
          >
            <NextIconCustom
              background="transparent"
              width={25}
              height={25}
            ></NextIconCustom>
          </Button>
        );
      }}
    >
      {childrenGroupArray.length !== 0
        ? childrenGroupArray.map((group: JSX.Element[], index: number) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: useMediaQuery.isMobile
                    ? "center"
                    : "flex-start",
                  alignItems: "center",
                  padding: useMediaQuery.isMobile ? "8px 8px" : "8px 96px",
                  overflow: "visible",
                  gap: "24px",
                  minHeight: 226,
                }}
              >
                {group}
              </Box>
            );
          })
        : [
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px 96px",
                overflow: "visible",
                gap: "24px",
                minHeight: 226,
              }}
            >
              {translate("No courses", language)}
            </Box>,
          ]}
    </Carousel>
  );
};

export default React.memo(CustomCarousel);
