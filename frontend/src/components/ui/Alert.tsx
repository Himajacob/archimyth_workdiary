type Props = {
  type: "success" | "error";
  message: string;
};

export default function Alert({
  type,
  message,
}: Props) {

  return (

    <div
      className={`
        mb-6
        rounded-2xl
        border
        px-5
        py-4
        text-sm
        font-medium
        shadow-sm

        ${
          type === "success"
            ? `
              border-green-200
              bg-green-50
              text-green-800
            `
            : `
              border-red-200
              bg-red-50
              text-red-700
            `
        }
      `}
    >
      {message}
    </div>
  );
}