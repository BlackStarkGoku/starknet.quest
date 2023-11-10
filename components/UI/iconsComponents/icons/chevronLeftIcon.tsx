import React, { FunctionComponent } from "react";

const ChevronLeftIcon: FunctionComponent<IconProps> = ({ color, width }) => {
  return (
    <svg
      width={width}
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="ChevronLeftIcon">
        <path
          id="Icon/Back (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.31952 9.2443L5.09091 8.49998L4.31952 7.75566C3.89349 8.16673 3.89349 8.83322 4.31952 9.2443ZM6.63369 8.49998L11.6805 3.63027C12.1065 3.21919 12.1065 2.5527 11.6805 2.14162C11.2545 1.73054 10.5637 1.73054 10.1377 2.14162L4.31952 7.75566L5.09091 8.49998L4.31952 9.2443L10.1377 14.8583C10.5637 15.2694 11.2545 15.2694 11.6805 14.8583C12.1065 14.4473 12.1065 13.7808 11.6805 13.3697L6.63369 8.49998Z"
          fill={color}
        />
      </g>
    </svg>
  );
};
export default ChevronLeftIcon;
