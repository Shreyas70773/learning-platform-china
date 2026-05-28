'use client';

import { notFound } from 'next/navigation';
import { LabDetail } from '@/components/labs/LabDetail';
import { AI_LABS, getLab } from '@/data/labs';

export default function AiLabPage({ params }: { params: { labId: string } }) {
  const lab = getLab('ai', Number(params.labId));
  if (!lab) notFound();
  return <LabDetail track="ai" lab={lab} list={AI_LABS} />;
}
