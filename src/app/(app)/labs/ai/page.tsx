'use client';

import { LabList } from '@/components/labs/LabList';
import { AI_LABS } from '@/data/labs';

export default function AiLabsPage() {
  return (
    <LabList
      track="ai"
      labs={AI_LABS}
      title="AI 实验室"
      subtitle="和实战实验室相同的六个实验，全程用 AI 来完成，外加一节浏览器代理（Browser Agents）的介绍。"
    />
  );
}
