'use client';

import Link from 'next/link';
import {
  PlayCircle,
  BookOpen,
  Hammer,
  Bot,
  CheckCircle2,
  Circle,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/auth';
import { useProgress } from '@/components/providers/progress';
import { ProgressMeter, Pill } from '@/components/ui/Indicators';
import { THEORY_COUNT } from '@/data/theory';
import { PRACTICAL_COUNT, AI_COUNT } from '@/data/labs';
import {
  theoryPassedCount,
  labsDoneCount,
  videoDone,
} from '@/lib/progress';

export default function DashboardPage() {
  const { user } = useAuth();
  const { progress } = useProgress();

  const cards = [
    {
      href: '/video',
      icon: PlayCircle,
      title: '看学习视频',
      desc: '看完整概念视频，了解 AI 在采购中的应用。',
      footer: videoDone(progress) ? (
        <Pill tone="success" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
          已完成
        </Pill>
      ) : (
        <Pill tone="muted" icon={<Circle className="h-3.5 w-3.5" />}>
          未开始
        </Pill>
      ),
    },
    {
      href: '/theory',
      icon: BookOpen,
      title: '阅读理论内容',
      desc: '六章详细内容，每章后有一次理解测试。',
      footer: (
        <ProgressMeter done={theoryPassedCount(progress)} total={THEORY_COUNT} label="章节通过" />
      ),
    },
    {
      href: '/labs/practical',
      icon: Hammer,
      title: '实战实验室',
      desc: '六个动手实验，跟着步骤亲自做一遍。',
      footer: (
        <ProgressMeter
          done={labsDoneCount(progress, 'practical')}
          total={PRACTICAL_COUNT}
          label="实验完成"
        />
      ),
    },
    {
      href: '/labs/ai',
      icon: Bot,
      title: 'AI 实验室',
      desc: '用 AI 完成实验，外加一节浏览器代理介绍。',
      footer: (
        <ProgressMeter done={labsDoneCount(progress, 'ai')} total={AI_COUNT} label="实验完成" />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-12">
      <header className="mb-8">
        <p className="text-sm text-ink-3">欢迎回来{user ? '，' + user.name : ''}</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-[2.1rem]">
          继续你的学习
        </h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, transform: 'translateY(10px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
            >
              <Link
                href={card.href}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out-quint hover:-translate-y-0.5 hover:border-brand-tint-2 hover:shadow-md active:translate-y-0 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-tint text-brand-ink transition-colors duration-200 group-hover:bg-brand group-hover:text-[oklch(0.99_0.01_60)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-ink-3 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5 group-hover:text-brand-ink" />
                </div>

                <h2 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-2">{card.desc}</p>

                <div className="mt-auto pt-6">{card.footer}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
