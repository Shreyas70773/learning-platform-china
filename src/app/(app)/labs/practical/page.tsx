'use client';

import { LabList } from '@/components/labs/LabList';
import { PRACTICAL_LABS } from '@/data/labs';

export default function PracticalLabsPage() {
  return (
    <LabList
      track="practical"
      labs={PRACTICAL_LABS}
      title="实战实验室"
      subtitle="六个动手实验，跟着步骤亲自做一遍。除了 Lab 1 有一个十行的脚本，基本不需要写代码。"
    />
  );
}
