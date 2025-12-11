'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Loader2,
  Phone
} from 'lucide-react';
import {
  IconPhone,
  IconCheck,
  IconX,
  IconClock
} from '@tabler/icons-react';
import Link from 'next/link';
import { PageContainer } from '@/components/dashboard-modern/page-container';
import { MetricCard } from '@/components/dashboard-modern/metric-card';

interface CallLog {
  id: string;
  patientId: string;
  patientName: string;
  scheduledAt: string;
  duration: number;
  status: string;
  medications: string[];
  notes?: string;
}

export default function CallLogsPage() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/call-logs');
      if (response.ok) {
        const data = await response.json();
        setCallLogs(data.callLogs || []);
      }
    } catch (error) {
      console.error('Failed to fetch call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logs
  const filteredLogs = callLogs.filter((log) => {
    const matchesSearch = log.patientName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = callLogs.filter((log) => log.scheduledAt?.startsWith(today));
  const completedToday = todayLogs.filter((l) => l.status === 'completed').length;
  const missedToday = todayLogs.filter((l) => l.status === 'missed').length;
  const totalCompleted = callLogs.filter((l) => l.status === 'completed').length;
  const successRate = callLogs.length > 0 ? Math.round((totalCompleted / callLogs.length) * 100) : 0;

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 'missed':
        return <XCircle className='h-4 w-4 text-red-500' />;
      default:
        return <AlertCircle className='h-4 w-4 text-amber-500' />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className='bg-green-100 text-green-700 hover:bg-green-100'>Completed</Badge>;
      case 'missed':
        return <Badge className='bg-red-100 text-red-700 hover:bg-red-100'>Missed</Badge>;
      default:
        return <Badge className='bg-amber-100 text-amber-700 hover:bg-amber-100'>Pending</Badge>;
    }
  };

  return (
    <PageContainer>
      <div className='space-y-8'>
        {/* Header */}
        <div className='space-y-2'>
          <h1 className='text-foreground text-3xl font-bold tracking-tight'>
            Call Logs
          </h1>
          <p className='text-muted-foreground'>
            Monitor all medication reminder calls and patient responses
          </p>
        </div>

        {/* Metrics */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            title='Calls Today'
            value={todayLogs.length}
            description='Total calls made'
            icon={IconPhone}
          />
          <MetricCard
            title='Completed'
            value={completedToday}
            description='Successful today'
            icon={IconCheck}
          />
          <MetricCard
            title='Missed'
            value={missedToday}
            description='Unanswered today'
            icon={IconX}
          />
          <MetricCard
            title='Success Rate'
            value={`${successRate}%`}
            description='Overall completion'
            icon={IconClock}
          />
        </div>

        {/* Filters */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-1 items-center gap-4'>
            <div className='relative max-w-sm flex-1'>
              <Search className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Search by patient name...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-40'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='missed'>Missed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Call Logs Table */}
        <div className='bg-card border-border rounded-xl border'>
          <div className='border-b p-4'>
            <h3 className='text-foreground font-semibold'>
              Call History ({filteredLogs.length} calls)
            </h3>
          </div>
          {loading ? (
            <div className='flex items-center justify-center p-12'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <div className='divide-y'>
              {filteredLogs.length === 0 ? (
                <div className='p-8 text-center'>
                  <Phone className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                  <p className='text-muted-foreground'>
                    {callLogs.length === 0 ? 'No call logs yet. Calls will appear here as they are made.' : 'No calls found matching your filters.'}
                  </p>
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const { date, time } = formatDateTime(log.scheduledAt);
                  return (
                    <div key={log.id} className='p-4 transition-colors hover:bg-muted/50'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-3'>
                          {getStatusIcon(log.status)}
                          <div>
                            <div className='flex items-center gap-2'>
                              <Link
                                href={`/dashboard/patients/${log.patientId}`}
                                className='text-foreground font-medium hover:underline'
                              >
                                {log.patientName}
                              </Link>
                              {getStatusBadge(log.status)}
                            </div>
                            <p className='text-muted-foreground mt-0.5 text-sm'>
                              {date} at {time}
                            </p>
                            {log.notes && (
                              <p className='text-muted-foreground mt-1 text-sm'>
                                {log.notes}
                              </p>
                            )}
                            {log.medications?.length > 0 && (
                              <div className='mt-2 flex flex-wrap gap-1'>
                                {log.medications.map((med) => (
                                  <Badge key={med} variant='secondary' className='text-xs'>
                                    {med}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='text-muted-foreground text-right text-sm'>
                          {log.duration > 0 && (
                            <span>Duration: {formatDuration(log.duration)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
