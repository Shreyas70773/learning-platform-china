'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CircleCheck } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Indicators';
import { Button } from '@/components/ui/Button';
import { useProgress } from '@/components/providers/progress';
import { videoDone } from '@/lib/progress';
import { ApiError } from '@/lib/api';

export default function VideoPage() {
  const router = useRouter();
  const { progress, update } = useProgress();
  const done = videoDone(progress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function markComplete() {
    setSaving(true);
    setError(null);
    try {
      await update({ type: 'video', completed: true });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '保存失败，请稍后重试');
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <Breadcrumb items={[{ label: '主页', href: '/dashboard' }, { label: '学习视频' }]} />

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink">学习视频</h1>
      <p className="mt-2 max-w-prose text-ink-2">
        这段视频把 API、MCP、技能、子代理、多代理编排和评估六个概念，串成一套完整的体系。建议先看完它，再去读理论、做实验。
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-[oklch(0.18_0.01_45)] shadow-md">
        <video
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full"
          src="/learning-video.mp4"
        >
          你的浏览器不支持视频播放。
        </video>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {done ? (
          <div className="flex items-center gap-2 text-success-ink">
            <CircleCheck className="h-5 w-5" />
            <span className="text-sm font-medium">你已完成这段视频</span>
          </div>
        ) : (
          <p className="text-sm text-ink-3">看完之后，标记为完成，进度会自动保存。</p>
        )}

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            返回主页
          </Button>
          {!done && (
            <Button onClick={markComplete} loading={saving}>
              <Check className="h-4 w-4" />
              标记为完成
            </Button>
          )}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-danger-ink">{error}</p>}
    </div>
  );
}
