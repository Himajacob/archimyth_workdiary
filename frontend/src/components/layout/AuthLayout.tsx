type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Background Image */}
      <img
        src="/login-bg.jpeg"
        alt="background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        {children}
      </div>
    </div>
  );
}