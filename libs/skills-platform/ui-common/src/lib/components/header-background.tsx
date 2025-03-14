import clsx from 'clsx';

export interface HeaderBackgroundProps {
  className?: string;
}

export const HeaderBackground = ({ className }: HeaderBackgroundProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('tw-absolute -tw-right-1/2 tw-bottom-0 tw-left-0 sm:tw-right-0 sm:tw-blur-lg lg:-tw-bottom-1/4', className)}
      fill="none"
      viewBox="0 0 640 288"
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_430_17856)">
        <g filter="url(#filter0_f_430_17856)">
          <ellipse cx="520.5" cy="306.5" fill="#48C2FF" rx="82.5" ry="40.5"></ellipse>
        </g>
        <g filter="url(#filter1_f_430_17856)">
          <ellipse cx="196.5" cy="268.5" fill="#F1E6FF" rx="196.5" ry="46.5"></ellipse>
        </g>
        <g filter="url(#filter2_f_430_17856)">
          <path
            stroke="#D3B1FF"
            strokeWidth="2"
            d="M184 255c0 19.161-18.842 35-42.5 35S99 274.161 99 255s18.842-35 42.5-35 42.5 15.839 42.5 35z"
          ></path>
        </g>
        <g filter="url(#filter3_f_430_17856)">
          <path
            stroke="#F1E6FF"
            d="M205.5 238c0 28.986-23.944 52.5-53.5 52.5S98.5 266.986 98.5 238s23.944-52.5 53.5-52.5 53.5 23.514 53.5 52.5z"
          ></path>
        </g>
        <g filter="url(#filter4_f_430_17856)">
          <ellipse cx="1044.5" cy="261.5" fill="#FFE2E6" rx="252.5" ry="57.5"></ellipse>
        </g>
        <g filter="url(#filter5_f_430_17856)">
          <ellipse cx="640" cy="176.5" fill="#F9F5FF" rx="201" ry="40.5"></ellipse>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_430_17856"
          width="349"
          height="265"
          x="346"
          y="174"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_430_17856" stdDeviation="46"></feGaussianBlur>
        </filter>
        <filter
          id="filter1_f_430_17856"
          width="577"
          height="277"
          x="-92"
          y="130"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_430_17856" stdDeviation="46"></feGaussianBlur>
        </filter>
        <filter
          id="filter2_f_430_17856"
          width="135"
          height="120"
          x="74"
          y="195"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_430_17856" stdDeviation="12"></feGaussianBlur>
        </filter>
        <filter
          id="filter3_f_430_17856"
          width="140"
          height="138"
          x="82"
          y="169"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_430_17856" stdDeviation="8"></feGaussianBlur>
        </filter>
        <filter
          id="filter4_f_430_17856"
          width="1073"
          height="683"
          x="508"
          y="-80"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_430_17856" stdDeviation="142"></feGaussianBlur>
        </filter>
        <filter
          id="filter5_f_430_17856"
          width="858"
          height="537"
          x="211"
          y="-92"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_430_17856" stdDeviation="114"></feGaussianBlur>
        </filter>
        <clipPath id="clip0_430_17856">
          <path fill="#fff" d="M0 0H640V288H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};
