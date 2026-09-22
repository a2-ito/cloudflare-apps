import { Suspense } from "react";
import TagDetailClient from "./TagDetailClient";

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <TagDetailClient tagId={id} />
    </Suspense>
  );
}
