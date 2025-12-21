import { notFound } from 'next/navigation';
import { ThesisView } from '../thesis-view';
import { getPositionById } from '../mock-data';

interface PageProps {
  params: Promise<{ positionId: string }>;
}

export default async function PositionThesisPage({ params }: PageProps) {
  const { positionId } = await params;
  const position = getPositionById(positionId);

  if (!position) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ThesisView position={position} />
    </div>
  );
}
