'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Bot,
  User,
  AlertTriangle,
  Clock,
  FileCheck,
  Heart,
  Activity,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Volume2,
  Timer,
  Mic
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranscriptMessage {
  role: 'agent' | 'user';
  content: string;
}

interface TranscriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transcript: string;
  patientName: string;
  callDate: string;
  callStatus: string;
  duration?: number;
}

type Priority = 'critical' | 'urgent' | 'follow-up' | 'routine';
type Sentiment = 'positive' | 'neutral' | 'negative' | 'concerned';

interface VoiceAnalytics {
  estimatedMood: Sentiment;
  responsiveness: 'high' | 'medium' | 'low';
  clarity: 'clear' | 'moderate' | 'unclear';
  engagementLevel: number;
  avgResponseLength: number;
  patientTalkRatio: number;
}

interface TranscriptAnalysis {
  priority: Priority;
  sentiment: Sentiment;
  summary: string;
  keywords: string[];
  voiceAnalytics: VoiceAnalytics;
  healthIndicators: string[];
  actionItems: string[];
}

const HIGHLIGHT_KEYWORDS = {
  critical: [
    'emergency',
    'pain',
    'chest',
    'breathing',
    'fall',
    'accident',
    'urgent',
    'severe',
    'blood',
    'hospital',
    'help'
  ],
  medication: [
    'medication',
    'medicine',
    'drug',
    'dose',
    'dosage',
    'pill',
    'tablet',
    'prescription',
    'metformin',
    'lisinopril',
    'warfarin',
    'aspirin',
    'inhaler',
    'eye drops',
    'furosemide',
    'carvedilol'
  ],
  health: [
    'feeling',
    'symptoms',
    'dizzy',
    'dizziness',
    'nausea',
    'headache',
    'tired',
    'weak',
    'weakness',
    'better',
    'worse',
    'swelling',
    'breathing',
    'shortness'
  ],
  positive: [
    'confirmed',
    'taken',
    'yes',
    'okay',
    'good',
    'great',
    'fine',
    'thank',
    'better',
    'wonderful',
    'excellent'
  ],
  negative: [
    'forgot',
    'missed',
    'no',
    'not',
    "didn't",
    "haven't",
    'pain',
    'worse',
    'tired',
    'weak',
    'concerned'
  ]
};

function parseTranscript(transcript: string): TranscriptMessage[] {
  const lines = transcript.split('\n').filter((line) => line.trim());
  const messages: TranscriptMessage[] = [];

  for (const line of lines) {
    const agentMatch = line.match(/^Agent:\s*(.+)$/i);
    const userMatch = line.match(/^User:\s*(.+)$/i);

    if (agentMatch) {
      messages.push({ role: 'agent', content: agentMatch[1].trim() });
    } else if (userMatch) {
      messages.push({ role: 'user', content: userMatch[1].trim() });
    }
  }

  return messages;
}

function analyzeVoiceMetrics(messages: TranscriptMessage[]): VoiceAnalytics {
  const patientMessages = messages.filter((m) => m.role === 'user');
  const agentMessages = messages.filter((m) => m.role === 'agent');

  const avgResponseLength =
    patientMessages.length > 0
      ? patientMessages.reduce(
          (acc, m) => acc + m.content.split(' ').length,
          0
        ) / patientMessages.length
      : 0;

  const totalPatientWords = patientMessages.reduce(
    (acc, m) => acc + m.content.split(' ').length,
    0
  );
  const totalAgentWords = agentMessages.reduce(
    (acc, m) => acc + m.content.split(' ').length,
    0
  );
  const patientTalkRatio =
    totalPatientWords + totalAgentWords > 0
      ? Math.round(
          (totalPatientWords / (totalPatientWords + totalAgentWords)) * 100
        )
      : 0;

  const responsiveness =
    patientMessages.length >= agentMessages.length * 0.8
      ? 'high'
      : patientMessages.length >= agentMessages.length * 0.5
        ? 'medium'
        : 'low';

  const clarity =
    avgResponseLength >= 8
      ? 'clear'
      : avgResponseLength >= 4
        ? 'moderate'
        : 'unclear';

  const engagementLevel = Math.min(
    100,
    Math.round(
      patientTalkRatio * 0.4 +
        avgResponseLength * 3 +
        (responsiveness === 'high' ? 30 : responsiveness === 'medium' ? 20 : 10)
    )
  );

  const allPatientText = patientMessages
    .map((m) => m.content.toLowerCase())
    .join(' ');
  const positiveCount = HIGHLIGHT_KEYWORDS.positive.filter((kw) =>
    allPatientText.includes(kw)
  ).length;
  const negativeCount = HIGHLIGHT_KEYWORDS.negative.filter((kw) =>
    allPatientText.includes(kw)
  ).length;
  const healthConcernCount = HIGHLIGHT_KEYWORDS.health.filter((kw) =>
    allPatientText.includes(kw)
  ).length;

  let estimatedMood: Sentiment = 'neutral';
  if (negativeCount > positiveCount + 1 || healthConcernCount > 2) {
    estimatedMood = 'concerned';
  } else if (positiveCount > negativeCount + 1) {
    estimatedMood = 'positive';
  } else if (negativeCount > positiveCount) {
    estimatedMood = 'negative';
  }

  return {
    estimatedMood,
    responsiveness,
    clarity,
    engagementLevel,
    avgResponseLength: Math.round(avgResponseLength * 10) / 10,
    patientTalkRatio
  };
}

function analyzeTranscript(
  transcript: string,
  callStatus: string
): TranscriptAnalysis {
  const lowerTranscript = transcript.toLowerCase();
  const messages = parseTranscript(transcript);
  const voiceAnalytics = analyzeVoiceMetrics(messages);

  let priority: Priority = 'routine';
  let sentiment: Sentiment = voiceAnalytics.estimatedMood;
  let summary = '';
  const keywords: string[] = [];
  const healthIndicators: string[] = [];
  const actionItems: string[] = [];

  const hasCritical = HIGHLIGHT_KEYWORDS.critical.some((kw) =>
    lowerTranscript.includes(kw)
  );
  const hasConfirmation = HIGHLIGHT_KEYWORDS.positive.some((kw) =>
    lowerTranscript.includes(kw)
  );
  const hasMedicationMention = HIGHLIGHT_KEYWORDS.medication.some((kw) =>
    lowerTranscript.includes(kw)
  );

  if (
    lowerTranscript.includes('dizzy') ||
    lowerTranscript.includes('dizziness')
  ) {
    healthIndicators.push('Dizziness reported');
    actionItems.push('Monitor for continued dizziness');
  }
  if (lowerTranscript.includes('swelling')) {
    healthIndicators.push('Swelling observed');
    actionItems.push('Check fluid retention');
  }
  if (
    lowerTranscript.includes('weak') ||
    lowerTranscript.includes('weakness')
  ) {
    healthIndicators.push('Weakness reported');
    actionItems.push('Assess energy levels');
  }
  if (lowerTranscript.includes('tired')) {
    healthIndicators.push('Fatigue noted');
  }
  if (
    lowerTranscript.includes('breathing') ||
    lowerTranscript.includes('breath')
  ) {
    healthIndicators.push('Breathing concerns');
    actionItems.push('Monitor respiratory status');
  }
  if (lowerTranscript.includes('chest') || lowerTranscript.includes('heart')) {
    healthIndicators.push('Cardiac symptoms mentioned');
    actionItems.push('Urgent cardiac assessment needed');
  }

  Object.values(HIGHLIGHT_KEYWORDS)
    .flat()
    .forEach((kw) => {
      if (lowerTranscript.includes(kw) && !keywords.includes(kw)) {
        keywords.push(kw);
      }
    });

  if (hasCritical) {
    priority = 'critical';
    sentiment = 'concerned';
    summary =
      'Critical health concern detected. Patient mentioned symptoms requiring immediate medical attention.';
    if (!actionItems.includes('Contact healthcare provider immediately')) {
      actionItems.unshift('Contact healthcare provider immediately');
    }
  } else if (callStatus === 'missed') {
    priority = 'urgent';
    sentiment = 'neutral';
    summary =
      'Patient missed the medication reminder call. Follow-up required to ensure medication adherence.';
    actionItems.push('Schedule follow-up call');
    actionItems.push('Notify emergency contact if pattern continues');
  } else if (healthIndicators.length > 0) {
    priority = 'follow-up';
    summary = `Patient reported health concerns: ${healthIndicators.join(', ')}. Monitoring recommended.`;
  } else if (hasConfirmation && hasMedicationMention) {
    priority = 'routine';
    summary =
      'Medication adherence confirmed. Patient responded positively to reminder call.';
  } else {
    priority = 'routine';
    summary = 'Standard medication reminder call completed successfully.';
  }

  return {
    priority,
    sentiment,
    summary,
    keywords: keywords.slice(0, 8),
    voiceAnalytics,
    healthIndicators,
    actionItems
  };
}

function highlightText(text: string, keywords: string[]): React.ReactNode {
  if (keywords.length === 0) return text;

  const pattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isKeyword = keywords.some(
      (kw) => kw.toLowerCase() === part.toLowerCase()
    );
    if (isKeyword) {
      const isCritical = HIGHLIGHT_KEYWORDS.critical.some(
        (k) => k.toLowerCase() === part.toLowerCase()
      );
      const isHealth = HIGHLIGHT_KEYWORDS.health.some(
        (k) => k.toLowerCase() === part.toLowerCase()
      );
      return (
        <span
          key={index}
          className={cn(
            'rounded px-1 py-0.5 font-medium',
            isCritical && 'bg-red-200 dark:bg-red-900/50',
            isHealth && !isCritical && 'bg-amber-200 dark:bg-amber-900/50',
            !isCritical && !isHealth && 'bg-blue-200 dark:bg-blue-900/50'
          )}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

function getPriorityConfig(priority: Priority) {
  switch (priority) {
    case 'critical':
      return {
        badge: (
          <Badge className='gap-1.5 bg-red-500 text-white hover:bg-red-600'>
            <AlertTriangle className='h-3 w-3' />
            Critical
          </Badge>
        ),
        bgClass:
          'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
        iconClass: 'text-red-600 dark:text-red-400'
      };
    case 'urgent':
      return {
        badge: (
          <Badge className='gap-1.5 bg-orange-500 text-white hover:bg-orange-600'>
            <Clock className='h-3 w-3' />
            Urgent
          </Badge>
        ),
        bgClass:
          'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
        iconClass: 'text-orange-600 dark:text-orange-400'
      };
    case 'follow-up':
      return {
        badge: (
          <Badge className='gap-1.5 bg-amber-500 text-white hover:bg-amber-600'>
            <Clock className='h-3 w-3' />
            Follow-up
          </Badge>
        ),
        bgClass:
          'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
        iconClass: 'text-amber-600 dark:text-amber-400'
      };
    default:
      return {
        badge: (
          <Badge className='gap-1.5 bg-green-500 text-white hover:bg-green-600'>
            <FileCheck className='h-3 w-3' />
            Routine
          </Badge>
        ),
        bgClass:
          'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
        iconClass: 'text-green-600 dark:text-green-400'
      };
  }
}

function getSentimentIcon(sentiment: Sentiment) {
  switch (sentiment) {
    case 'positive':
      return <TrendingUp className='h-4 w-4 text-green-600' />;
    case 'negative':
      return <TrendingDown className='h-4 w-4 text-red-600' />;
    case 'concerned':
      return <AlertTriangle className='h-4 w-4 text-amber-600' />;
    default:
      return <Minus className='h-4 w-4 text-gray-500' />;
  }
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TranscriptModal({
  open,
  onOpenChange,
  transcript,
  patientName,
  callDate,
  callStatus,
  duration
}: TranscriptModalProps) {
  const messages = React.useMemo(
    () => parseTranscript(transcript),
    [transcript]
  );
  const analysis = React.useMemo(
    () => analyzeTranscript(transcript, callStatus),
    [transcript, callStatus]
  );
  const priorityConfig = getPriorityConfig(analysis.priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-[90vh] max-h-[800px] max-w-3xl flex-col gap-0 overflow-hidden p-0'>
        {/* Header */}
        <DialogHeader className='bg-muted/30 flex-shrink-0 border-b px-6 py-4'>
          <div className='flex items-start justify-between gap-4'>
            <div className='min-w-0 flex-1'>
              <DialogTitle className='flex items-center gap-3 text-xl font-bold'>
                <MessageCircle className='text-primary h-5 w-5' />
                Call Transcript
              </DialogTitle>
              <div className='text-muted-foreground mt-1 flex items-center gap-2 text-sm'>
                <span className='text-foreground font-medium'>
                  {patientName}
                </span>
                <span>•</span>
                <span>{callDate}</span>
                {duration && duration > 0 && (
                  <>
                    <span>•</span>
                    <Timer className='h-3 w-3' />
                    <span>{formatDuration(duration)}</span>
                  </>
                )}
              </div>
            </div>
            <div className='flex-shrink-0'>{priorityConfig.badge}</div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
          <ScrollArea className='flex-1'>
            <div className='space-y-6 p-6'>
              {/* Summary Card */}
              <div
                className={cn('rounded-xl border p-4', priorityConfig.bgClass)}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={cn(
                      'rounded-lg bg-white/80 p-2 dark:bg-gray-900/50',
                      priorityConfig.iconClass
                    )}
                  >
                    <Activity className='h-5 w-5' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h4 className='mb-1 text-sm font-semibold'>Call Summary</h4>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      {analysis.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Voice Analytics & Health Indicators Grid */}
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* Voice Analytics */}
                <div className='bg-card rounded-xl border p-4'>
                  <h4 className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                    <Volume2 className='text-primary h-4 w-4' />
                    Voice Analytics
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Sentiment
                      </span>
                      <div className='flex items-center gap-2'>
                        {getSentimentIcon(analysis.sentiment)}
                        <span className='text-sm font-medium capitalize'>
                          {analysis.sentiment}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Engagement
                      </span>
                      <div className='flex items-center gap-2'>
                        <div className='bg-muted h-2 w-16 overflow-hidden rounded-full'>
                          <div
                            className={cn(
                              'h-full rounded-full',
                              analysis.voiceAnalytics.engagementLevel >= 70
                                ? 'bg-green-500'
                                : analysis.voiceAnalytics.engagementLevel >= 40
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            )}
                            style={{
                              width: `${analysis.voiceAnalytics.engagementLevel}%`
                            }}
                          />
                        </div>
                        <span className='text-sm font-medium'>
                          {analysis.voiceAnalytics.engagementLevel}%
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Responsiveness
                      </span>
                      <Badge
                        variant='outline'
                        className={cn(
                          'text-xs capitalize',
                          analysis.voiceAnalytics.responsiveness === 'high' &&
                            'border-green-500 text-green-600',
                          analysis.voiceAnalytics.responsiveness === 'medium' &&
                            'border-amber-500 text-amber-600',
                          analysis.voiceAnalytics.responsiveness === 'low' &&
                            'border-red-500 text-red-600'
                        )}
                      >
                        {analysis.voiceAnalytics.responsiveness}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Speech Clarity
                      </span>
                      <Badge variant='outline' className='text-xs capitalize'>
                        {analysis.voiceAnalytics.clarity}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Health Indicators & Action Items */}
                <div className='bg-card rounded-xl border p-4'>
                  <h4 className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                    <Heart className='h-4 w-4 text-red-500' />
                    Health Indicators
                  </h4>
                  {analysis.healthIndicators.length > 0 ? (
                    <div className='mb-4 space-y-2'>
                      {analysis.healthIndicators.map((indicator, i) => (
                        <div
                          key={i}
                          className='flex items-center gap-2 text-sm'
                        >
                          <div className='h-1.5 w-1.5 rounded-full bg-amber-500' />
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground mb-4 text-sm'>
                      No health concerns detected
                    </p>
                  )}

                  {analysis.actionItems.length > 0 && (
                    <>
                      <Separator className='my-3' />
                      <h5 className='text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase'>
                        Action Items
                      </h5>
                      <div className='space-y-1.5'>
                        {analysis.actionItems.map((item, i) => (
                          <div
                            key={i}
                            className='flex items-start gap-2 text-sm'
                          >
                            <div className='border-primary/30 mt-0.5 h-4 w-4 flex-shrink-0 rounded border' />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Keywords */}
              {analysis.keywords.length > 0 && (
                <div>
                  <h4 className='mb-2 flex items-center gap-2 text-sm font-semibold'>
                    <Mic className='text-primary h-4 w-4' />
                    Key Topics Mentioned
                  </h4>
                  <div className='flex flex-wrap gap-1.5'>
                    {analysis.keywords.map((keyword) => {
                      const isCritical =
                        HIGHLIGHT_KEYWORDS.critical.includes(keyword);
                      const isHealth =
                        HIGHLIGHT_KEYWORDS.health.includes(keyword);
                      return (
                        <Badge
                          key={keyword}
                          variant='secondary'
                          className={cn(
                            'text-xs',
                            isCritical &&
                              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                            isHealth &&
                              !isCritical &&
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          )}
                        >
                          {keyword}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              <Separator />

              {/* Transcript Messages */}
              <div>
                <h4 className='mb-4 flex items-center gap-2 text-sm font-semibold'>
                  <MessageCircle className='text-primary h-4 w-4' />
                  Full Transcript
                </h4>
                <div className='space-y-3'>
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex gap-3',
                          message.role === 'user' && 'flex-row-reverse'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                            message.role === 'agent'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                          )}
                        >
                          {message.role === 'agent' ? (
                            <Bot className='h-4 w-4' />
                          ) : (
                            <User className='h-4 w-4' />
                          )}
                        </div>
                        <div
                          className={cn(
                            'max-w-[75%] rounded-2xl px-4 py-2.5',
                            message.role === 'agent'
                              ? 'bg-muted rounded-tl-sm'
                              : 'bg-primary/10 rounded-tr-sm'
                          )}
                        >
                          <div className='mb-0.5'>
                            <span
                              className={cn(
                                'text-xs font-semibold',
                                message.role === 'agent'
                                  ? 'text-primary'
                                  : 'text-foreground'
                              )}
                            >
                              {message.role === 'agent' ? 'CuraBot' : 'Patient'}
                            </span>
                          </div>
                          <p className='text-sm leading-relaxed'>
                            {highlightText(message.content, analysis.keywords)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-muted-foreground py-12 text-center'>
                      <MessageCircle className='mx-auto mb-3 h-12 w-12 opacity-30' />
                      <p className='font-medium'>No transcript available</p>
                      <p className='text-sm'>
                        This call does not have a recorded transcript.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
