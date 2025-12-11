'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Phone,
  FileText,
  Pill,
  Heart,
  StickyNote,
  Plus,
  Loader2,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/components/dashboard-modern/page-container';
import { PageHeader } from '@/components/dashboard-modern/page-header';
import { toast } from 'sonner';

interface TimelineEvent {
  id: string;
  type: 'call' | 'medication_change' | 'health_update' | 'record_added' | 'note';
  title: string;
  description?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface Patient {
  id: string;
  name: string;
}

export default function PatientTimelinePage() {
  const params = useParams();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({
    type: 'note' as const,
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [patientRes, timelineRes] = await Promise.all([
        fetch(`/api/patients/${patientId}`),
        fetch(`/api/patients/${patientId}/timeline`)
      ]);
      
      if (!patientRes.ok) throw new Error('Patient not found');
      
      const patientData = await patientRes.json();
      setPatient(patientData.patient);
      
      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        setTimeline(timelineData.timeline || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteForm.title) {
      toast.error('Please enter a title');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/patients/${patientId}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteForm)
      });

      if (!response.ok) throw new Error('Failed to add note');

      toast.success('Note added to timeline');
      setNoteDialogOpen(false);
      setNoteForm({ type: 'note', title: '', description: '' });
      fetchData();
    } catch {
      toast.error('Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className='h-5 w-5 text-blue-600' />;
      case 'medication_change':
        return <Pill className='h-5 w-5 text-purple-600' />;
      case 'health_update':
        return <Heart className='h-5 w-5 text-red-500' />;
      case 'record_added':
        return <FileText className='h-5 w-5 text-green-600' />;
      case 'note':
        return <StickyNote className='h-5 w-5 text-amber-600' />;
      default:
        return <Calendar className='h-5 w-5 text-gray-500' />;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'call':
        return <Badge className='bg-blue-100 text-blue-700'>Call</Badge>;
      case 'medication_change':
        return <Badge className='bg-purple-100 text-purple-700'>Medication</Badge>;
      case 'health_update':
        return <Badge className='bg-red-100 text-red-700'>Health Update</Badge>;
      case 'record_added':
        return <Badge className='bg-green-100 text-green-700'>Record</Badge>;
      case 'note':
        return <Badge className='bg-amber-100 text-amber-700'>Note</Badge>;
      default:
        return <Badge variant='secondary'>Event</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Group events by date
  const groupedEvents = timeline.reduce(
    (groups, event) => {
      const date = new Date(event.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    },
    {} as Record<string, TimelineEvent[]>
  );

  if (loading) {
    return (
      <PageContainer>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      </PageContainer>
    );
  }

  if (error || !patient) {
    return (
      <PageContainer>
        <div className='flex min-h-[60vh] flex-col items-center justify-center'>
          <p className='text-destructive mb-4'>{error || 'Patient not found'}</p>
          <Link href='/dashboard/patients'>
            <Button>Back to Patients</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-8'>
        <PageHeader
          title={`Timeline: ${patient.name}`}
          description='Chronological view of all patient events, calls, and updates'
        >
          <div className='flex gap-2'>
            <Link href={`/dashboard/patients/${patientId}`}>
              <Button variant='outline' className='flex items-center gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Back to Patient
              </Button>
            </Link>
            <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Timeline Note</DialogTitle>
                  <DialogDescription>
                    Add a note or observation to the patient&apos;s timeline.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Event Type</label>
                    <Select
                      value={noteForm.type}
                      onValueChange={(v: 'note') => setNoteForm({ ...noteForm, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='note'>General Note</SelectItem>
                        <SelectItem value='health_update'>Health Update</SelectItem>
                        <SelectItem value='medication_change'>Medication Change</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Title</label>
                    <Input
                      placeholder='e.g., Blood pressure check'
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Description</label>
                    <Textarea
                      placeholder='Add details...'
                      value={noteForm.description}
                      onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant='outline' onClick={() => setNoteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote} disabled={submitting}>
                    {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Add Note
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </PageHeader>

        {/* Timeline */}
        <div className='relative'>
          {Object.keys(groupedEvents).length > 0 ? (
            <div className='space-y-8'>
              {Object.entries(groupedEvents).map(([dateStr, events]) => (
                <div key={dateStr} className='relative'>
                  {/* Date Header */}
                  <div className='sticky top-0 z-10 mb-4'>
                    <div className='bg-background inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm font-medium'>{formatDate(events[0].createdAt)}</span>
                    </div>
                  </div>

                  {/* Events for this date */}
                  <div className='relative ml-6 border-l-2 border-muted pl-6'>
                    {events.map((event, index) => (
                      <div
                        key={event.id}
                        className={`relative pb-8 ${index === events.length - 1 ? 'pb-0' : ''}`}
                      >
                        {/* Timeline dot */}
                        <div className='absolute -left-[31px] flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-background'>
                          {getEventIcon(event.type)}
                        </div>

                        {/* Event Card */}
                        <div className='bg-card border-border rounded-xl border p-4 shadow-sm'>
                          <div className='flex items-start justify-between'>
                            <div className='space-y-1'>
                              <div className='flex items-center gap-2'>
                                <span className='font-medium text-foreground'>
                                  {event.title}
                                </span>
                                {getEventBadge(event.type)}
                              </div>
                              {event.description && (
                                <p className='text-sm text-muted-foreground'>
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <span className='text-xs text-muted-foreground'>
                              {formatTime(event.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-card border-border rounded-xl border p-12 text-center'>
              <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium text-foreground mb-2'>No timeline events yet</h3>
              <p className='text-muted-foreground mb-4'>
                Timeline will populate as calls are made and records are added.
              </p>
              <Button onClick={() => setNoteDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Add First Note
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
