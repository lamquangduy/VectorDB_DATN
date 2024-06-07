import React from "react";
import ReactEcharts from "echarts-for-react";

const loadingOption = (loadingMessage: string) => {
  return {
    graphic: {
      elements: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: loadingMessage,
            fontSize: 80,
            fontWeight: "bold",
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: "white",
            stroke: "#075849",
            lineWidth: 3,
          },
          keyframeAnimation: {
            duration: 2000,
            loop: true,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: "white",
                  lineDashOffset: 200,
                  lineDash: [200, 0],
                },
              },
              {
                // Stop for a while.
                percent: 0.8,
                style: {
                  fill: "white",
                },
              },
              {
                percent: 1,
                style: {
                  fill: "white",
                },
              },
            ],
          },
        },
      ],
    },
  };
};

const ChartView = ({
  height = "100%",
  width = "100%",
  isLoading = true,
  optionData = {},
  onEvents = {},
  loadingMessage = "Loading",
}) => {
  return React.useMemo(() => {
    return (
      <ReactEcharts
        style={{ height: height, width: width }}
        option={{
          ...(isLoading === true ? loadingOption(loadingMessage) : optionData),
        }}
        opts={{ renderer: "svg" }}
        notMerge={true}
        onEvents={onEvents}
      />
    );
  }, [optionData, isLoading]);
};

export default React.memo(ChartView);
