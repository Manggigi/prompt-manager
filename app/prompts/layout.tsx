import ProtectedRoute from "@/components/ProtectedRoute";

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
