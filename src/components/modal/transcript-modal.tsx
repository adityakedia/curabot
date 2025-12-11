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
import { Bot, User, AlertTriangle, Clock, FileCheck } from 'lucide-react';
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
}

type Priority = 'critical' | 'urgent' | 'follow-up' | 'routine';

interface TranscriptAnalysis {
  priority: Priority;
  summary: string;
  keywords: string[];
}

// Keywords to highlight in the transcript
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
    'hospital'
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
    'aspirin'
  ],
  health: [
    'feeling',
    'symptoms',
    'dizzy',
    'nausea',
    'headache',
    'tired',
    'weak',
    'better',
    'worse'
  ],
  positive: [
    'confirmed',
    'taken',
    'yes',
    'okay',
    'good',
    'great',
    'fine',
    'thank'
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

function analyzeTranscript(
  transcript: string,
  callStatus: string
): TranscriptAnalysis {
  const lowerTranscript = transcript.toLowerCase();

  // Determine priority based on keywords and call status
  let priority: Priority = 'routine';
  let summary = '';
  const keywords: string[] = [];

  // Check for critical keywords
  const hasCritical = HIGHLIGHT_KEYWORDS.critical.some((kw) =>
    lowerTranscript.includes(kw)
  );
  const hasConfirmation = HIGHLIGHT_KEYWORDS.positive.some((kw) =>
    lowerTranscript.includes(kw)
  );
  const hasMedicationMention = HIGHLIGHT_KEYWORDS.medication.some((kw) =>
    lowerTranscript.includes(kw)
  );
  const hasHealthConcerns = HIGHLIGHT_KEYWORDS.health.some(
    (kw) =>
      lowerTranscript.includes(kw) &&
      (lowerTranscript.includes('not') || lowerTranscript.includes("n't"))
  );

  // Extract found keywords
  Object.values(HIGHLIGHT_KEYWORDS)
    .flat()
    .forEach((kw) => {
      if (lowerTranscript.includes(kw) && !keywords.includes(kw)) {
        keywords.push(kw);
      }
    });

  if (hasCritical) {
    priority = 'critical';
    summary =
      'Patient mentioned critical health concern. Immediate attention may be required.';
  } else if (callStatus === 'missed') {
    priority = 'urgent';
    summary =
      'Patient missed the medication reminder call. Follow-up required to ensure medication adherence.';
  } else if (hasHealthConcerns || !hasConfirmation) {
    priority = 'follow-up';
    summary =
      'Patient interaction indicates potential concerns. Consider scheduling a follow-up check.';
  } else if (hasConfirmation && hasMedicationMention) {
    priority = 'routine';
    summary =
      'Patient confirmed medication intake. Call completed successfully with no concerns.';
  } else {
    priority = 'routine';
    summary = 'Standard medication reminder call completed.';
  }

  return { priority, summary, keywords: keywords.slice(0, 8) };
}

function highlightText(text: string, keywords: string[]): React.ReactNode {
  if (keywords.length === 0) return text;

  const pattern = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isKeyword = keywords.some(
      (kw) => kw.toLowerCase() === part.toLowerCase()
    );
    if (isKeyword) {
      return (
        <span
          key={index}
          className='rounded bg-yellow-200 px-0.5 font-medium dark:bg-yellow-900/50'
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

function getPriorityBadge(priority: Priority) {
  switch (priority) {
    case 'critical':
      return (
        <Badge className='gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'>
          <AlertTriangle className='h-3 w-3' />
          Critical
        </Badge>
      );
    case 'urgent':
      return (
        <Badge className='gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'>
          <Clock className='h-3 w-3' />
          Urgent
        </Badge>
      );
    case 'follow-up':
      return (
        <Badge className='gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'>
          <Clock className='h-3 w-3' />
          Follow-up
        </Badge>
      );
    default:
      return (
        <Badge className='gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'>
          <FileCheck className='h-3 w-3' />
          Routine
        </Badge>
      );
  }
}

export function TranscriptModal({
  open,
  onOpenChange,
  transcript,
  patientName,
  callDate,
  callStatus
}: TranscriptModalProps) {
  const messages = React.useMemo(
    () => parseTranscript(transcript),
    [transcript]
  );
  const analysis = React.useMemo(
    () => analyzeTranscript(transcript, callStatus),
    [transcript, callStatus]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[85vh] max-w-2xl flex-col'>
        <DialogHeader>
          <div className='flex items-center justify-between pr-8'>
            <DialogTitle className='text-xl'>Call Transcript</DialogTitle>
            {getPriorityBadge(analysis.priority)}
          </div>
          <div className='text-muted-foreground text-sm'>
            {patientName} • {callDate}
          </div>
        </DialogHeader>

        {/* Summary Section */}
        <div
          className={cn(
            'rounded-lg border p-4',
            analysis.priority === 'critical' &&
              'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20',
            analysis.priority === 'urgent' &&
              'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20',
            analysis.priority === 'follow-up' &&
              'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20',
            analysis.priority === 'routine' &&
              'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20'
          )}
        >
          <h4 className='mb-1 text-sm font-semibold'>Summary</h4>
          <p className='text-muted-foreground text-sm'>{analysis.summary}</p>
          {analysis.keywords.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {analysis.keywords.map((keyword) => (
                <Badge key={keyword} variant='secondary' className='text-xs'>
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Transcript Messages */}
        <ScrollArea className='min-h-0 flex-1'>
          <div className='space-y-4 p-1'>
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex gap-3',
                    message.role === 'agent' ? 'flex-row' : 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                      message.role === 'agent'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
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
                      'max-w-[80%] flex-1 rounded-lg px-4 py-2',
                      message.role === 'agent' ? 'bg-muted' : 'bg-primary/10'
                    )}
                  >
                    <div className='mb-1 flex items-center gap-2'>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          message.role === 'agent'
                            ? 'text-primary'
                            : 'text-foreground'
                        )}
                      >
                        {message.role === 'agent' ? 'CuraBot' : 'Patient'}
                      </span>
                    </div>
                    <p className='text-sm'>
                      {highlightText(message.content, analysis.keywords)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-muted-foreground py-8 text-center'>
                <p>No transcript available for this call.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
