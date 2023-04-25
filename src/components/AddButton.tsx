const plugSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const buttonStyle =
  "flex items-center justify-center bg-slate-500 rounded p-2 opacity-30 hover:opacity-70";

const AddButton = ({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) => (
  <button className={[buttonStyle, className].join(" ")} onClick={onClick}>
    {plugSVG}
  </button>
);

export default AddButton;
