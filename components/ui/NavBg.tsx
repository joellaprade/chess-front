const NavBg = ({ className }: { className: string }) => {
  return (
    <svg
      className={className}
      height="250" // Keep the height fixed
      viewBox="0 0 747 271" // Maintain the viewBox for reference
      preserveAspectRatio="none" // Ensures the aspect ratio is ignored
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 200H747L687.439 219.694C483.574 287.103 263.426 287.103 59.561 219.694L0 200Z"
        fill="#262421"
      />
      <path d="M0 0H747V200H0V0Z" fill="#262421" />
    </svg>
  );
};

export default NavBg;
