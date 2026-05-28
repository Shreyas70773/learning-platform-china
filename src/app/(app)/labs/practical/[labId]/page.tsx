'use client';

import { notFound } from 'next/navigation';
import { LabDetail } from '@/components/labs/LabDetail';
import { PRACTICAL_LABS, getLab } from '@/data/labs';

export default function PracticalLabPage({ params }: { params: { labId: string } }) {
  const lab = getLab('practical', Number(params.labId));
  if (!lab) notFound();
  return <LabDetail track="practical" lab={lab} list={PRACTICAL_LABS} />;
}
