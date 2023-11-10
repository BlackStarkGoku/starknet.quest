import React, { FunctionComponent } from "react";

const ChevronRightIcon: FunctionComponent<IconProps> = ({ color, width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="17"
      viewBox="0 0 16 17"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6805 7.7557L10.9091 8.50002L11.6805 9.24434C12.1065 8.83327 12.1065 8.16678 11.6805 7.7557ZM9.36631 8.50002L4.31952 13.3697C3.89349 13.7808 3.89349 14.4473 4.31952 14.8584C4.74555 15.2695 5.43627 15.2695 5.8623 14.8584L11.6805 9.24434L10.9091 8.50002L11.6805 7.7557L5.8623 2.14166C5.43627 1.73058 4.74554 1.73058 4.31952 2.14166C3.89349 2.55274 3.89349 3.21923 4.31952 3.63031L9.36631 8.50002Z"
        fill={color}
      />
    </svg>
  );
};
export default ChevronRightIcon;
