'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Clock } from 'lucide-react';
import {
  IconUsers,
  IconPhone,
  IconCheck,
  IconAlertTriangle
} from '@tabler/icons-react';
import Link from 'next/link';
import { PageContainer } from '@/components/dashboard-modern/page-container';
import { PageHeader } from '@/components/dashboard-modern/page-header';
import { MetricCard } from '@/components/dashboard-modern/metric-card';
import { Badge } from '@/components/ui/badge';

interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  status: string;
  adherenceRate: number;
  medications: { id: string; name: string; time: string; dosage: string }[];
  callLogs: { id: string; scheduledAt: string; status: string }[];
}

interface Stats {
  totalPatients: number;
  activePatients: number;
  needsAttention: number;
  completedCalls: number;
  missedCalls: number;
  successRate: number;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const seedDemoData = async () => {
    try {
      const response = await fetch('/api/userdata/seed', { method: 'POST' });
      const data = await response.json();
      return data.seeded === true;
    } catch (err) {
      console.error('Failed to seed demo data:', err);
      return false;
    }
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients');

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();

      // If no patients, auto-seed demo data for new users
      if (!data.patients || data.patients.length === 0) {
        const seeded = await seedDemoData();
        if (seeded) {
          // Re-fetch after seeding
          const retryResponse = await fetch('/api/patients');
          const retryData = await retryResponse.json();
          setPatients(retryData.patients || []);
          setStats(retryData.stats || null);
          return;
        }
      }

      setPatients(data.patients || []);
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <div className='text-center'>
            <Loader2 className='text-muted-foreground mx-auto mb-4 h-8 w-8 animate-spin' />
            <p className='text-muted-foreground'>Loading patients...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <div className='text-center'>
            <p className='text-destructive mb-4'>{error}</p>
            <Button onClick={fetchPatients}>Try Again</Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-8'>
        {/* Welcome Section */}
        <div className='space-y-2'>
          <h1 className='text-foreground text-3xl font-bold tracking-tight'>
            Patient Care Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Monitor medication adherence and manage care schedules for your
            loved ones
          </p>
        </div>

        {/* Metrics Cards */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            title='Total Patients'
            value={stats?.totalPatients || patients.length}
            description='Under your care'
            icon={IconUsers}
          />
          <MetricCard
            title='Active Today'
            value={stats?.activePatients || 0}
            description='Scheduled for calls'
            icon={IconPhone}
          />
          <MetricCard
            title='Needs Attention'
            value={stats?.needsAttention || 0}
            description='Missed calls or doses'
            icon={IconAlertTriangle}
          />
          <MetricCard
            title='Success Rate'
            value={`${stats?.successRate || 0}%`}
            description='Call completion'
            icon={IconCheck}
          />
        </div>

        {/* Patients Section */}
        <PageHeader
          title='Patients'
          description='Manage elderly patients and their care routines'
        >
          <Link href='/dashboard/patients/new'>
            <Button className='bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              Add Patient
            </Button>
          </Link>
        </PageHeader>

        {/* Patients List */}
        {patients.length > 0 ? (
          <div className='space-y-4'>
            {patients.map((patient) => (
              <Link key={patient.id} href={`/dashboard/patients/${patient.id}`}>
                <div className='bg-card border-border hover:border-primary/20 cursor-pointer rounded-xl border p-6 transition-all hover:shadow-md'>
                  <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    {/* Patient Info */}
                    <div className='flex items-center gap-4'>
                      <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
                        <span className='text-primary text-lg font-semibold'>
                          {patient.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className='text-foreground font-semibold'>
                          {patient.name}
                        </h3>
                        <p className='text-muted-foreground text-sm'>
                          {patient.age} years • {patient.phone}
                        </p>
                      </div>
                    </div>

                    {/* Medications */}
                    <div className='flex flex-wrap gap-2'>
                      {patient.medications.slice(0, 3).map((med) => (
                        <Badge
                          key={med.id}
                          variant='secondary'
                          className='text-xs'
                        >
                          {med.name}
                        </Badge>
                      ))}
                      {patient.medications.length > 3 && (
                        <Badge variant='secondary' className='text-xs'>
                          +{patient.medications.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Status */}
                    <div className='flex items-center gap-6'>
                      <div className='text-right'>
                        <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                          <Clock className='h-3 w-3' />
                          <span>{patient.medications.length} medications</span>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <div
                          className={`h-2 w-2 rounded-full ${
                            patient.status === 'active'
                              ? 'bg-green-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className='text-sm font-medium'>
                          {patient.adherenceRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-16'>
            <div className='bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
              <IconUsers className='text-muted-foreground h-10 w-10' />
            </div>
            <h3 className='text-foreground mb-2 text-xl font-bold'>
              No patients yet
            </h3>
            <p className='text-muted-foreground mb-6 max-w-md text-center'>
              Start by adding your first patient to set up medication reminders
              and wellness check-ins
            </p>
            <Link href='/dashboard/patients/new'>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                Add Patient
              </Button>
            </Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
