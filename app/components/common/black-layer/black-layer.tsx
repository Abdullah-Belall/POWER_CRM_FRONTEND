"use client";

export default function BlackLayer({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClick();
        }
      }}
      className="backdrop-blur-[1px] flex justify-center items-center w-full h-full fixed left-0 top-0 bg-[#00000066] z-30"
    >
      {children}
    </div>
  );
}
