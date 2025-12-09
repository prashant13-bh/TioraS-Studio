import type { SVGProps } from "react";

export const TiorasLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="currentColor"
      d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"
    />
    <path
      fill="currentColor"
      d="M168 88H88a8 8 0 0 0 0 16h32v64a8 8 0 0 0 16 0v-64h32a8 8 0 0 0 0-16Z"
    />
  </svg>
);
