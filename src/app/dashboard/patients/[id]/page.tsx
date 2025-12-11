'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  FileText,
  Loader2
} from 'lucide-react';
import { IconPhone, IconPill, IconHeart, IconFile, IconTimeline } from '@tabler/icons-react';
import Link from 'next/link';
import { PageContainer } from '@/components/dashboard-modern/page-container';
import { PageHeader } from '@/components/dashboard-modern/page-header';
import { MetricCard } from '@/components/dashboard-modern/metric-card';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
}

interface CallLog {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  medications: string[];
  notes?: string;
}

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  description?: string;
  recordDate: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalConditions?: string;
  notes?: string;
  status: string;
  adherenceRate: number;
  createdAt: string;
  medications: Medication[];
  callLogs: CallLog[];
  medicalRecords: MedicalRecord[];
}

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [recordForm, setRecordForm] = useState({
    type: 'diagnosis',
    title: '',
    description: '',
    recordDate: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patients/${patientId}`);
      
      if (!response.ok) {
        throw new Error('Patient not found');
      }
      
      const data = await response.json();
      setPatient(data.patient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!recordForm.title) {
      toast.error('Please enter a title');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/patients/${patientId}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordForm)
      });

      if (!response.ok) throw new Error('Failed to add record');

      toast.success('Medical record added');
      setRecordDialogOpen(false);
      setRecordForm({
        type: 'diagnosis',
        title: '',
        description: '',
        recordDate: new Date().toISOString().split('T')[0]
      });
      fetchPatient();
    } catch {
      toast.error('Failed to add record');
    } finally {
      setSubmitting(false);
    }
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

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'diagnosis':
        return <FileText className='h-4 w-4 text-blue-600' />;
      case 'prescription':
        return <IconPill className='h-4 w-4 text-green-600' />;
      default:
        return <IconFile className='h-4 w-4 text-purple-600' />;
    }
  };

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

  const completedCalls = patient.callLogs?.filter((c) => c.status === 'completed').length || 0;

  return (
    <PageContainer>
      <div className='space-y-8'>
        <PageHeader
          title={patient.name}
          description={`${patient.age} years old • Patient since ${new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
        >
          <div className='flex gap-2'>
            <Link href='/dashboard/patients'>
              <Button variant='outline' className='flex items-center gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
            </Link>
            <Link href={`/dashboard/patients/${patientId}/timeline`}>
              <Button variant='outline' className='flex items-center gap-2'>
                <IconTimeline className='h-4 w-4' />
                Timeline
              </Button>
            </Link>
            <Button className='flex items-center gap-2'>
              <Phone className='h-4 w-4' />
              Call Now
            </Button>
          </div>
        </PageHeader>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <MetricCard title='Adherence Rate' value={`${patient.adherenceRate}%`} description='Medication compliance' icon={IconHeart} />
          <MetricCard title='Total Calls' value={patient.callLogs?.length || 0} description='All time' icon={IconPhone} />
          <MetricCard title='Completed' value={completedCalls} description='Successful reminders' icon={IconPill} />
          <MetricCard title='Records' value={patient.medicalRecords?.length || 0} description='Medical documents' icon={IconFile} />
        </div>

        <Tabs defaultValue='schedule' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='schedule'>Medications</TabsTrigger>
            <TabsTrigger value='records'>Medical Records</TabsTrigger>
            <TabsTrigger value='logs'>Call History</TabsTrigger>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
          </TabsList>

          <TabsContent value='schedule' className='space-y-4'>
            <div className='bg-card border-border rounded-xl border p-6'>
              <h3 className='text-foreground mb-4 text-lg font-semibold'>Daily Medication Schedule</h3>
              {patient.medications?.length > 0 ? (
                <div className='space-y-4'>
                  {patient.medications.map((med) => (
                    <div key={med.id} className='bg-muted/50 flex items-center justify-between rounded-lg p-4'>
                      <div className='flex items-center gap-4'>
                        <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                          <Clock className='text-primary h-5 w-5' />
                        </div>
                        <div>
                          <p className='text-foreground font-medium'>{med.name}</p>
                          <p className='text-muted-foreground text-sm'>{med.dosage} • {med.frequency}</p>
                        </div>
                      </div>
                      <Badge variant='outline' className='text-lg font-semibold'>{med.time}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground text-center py-8'>No medications scheduled</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value='records' className='space-y-4'>
            <div className='bg-card border-border rounded-xl border'>
              <div className='flex items-center justify-between border-b p-4'>
                <h3 className='text-foreground font-semibold'>Medical Records</h3>
                <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size='sm' className='flex items-center gap-2'>
                      <Plus className='h-4 w-4' />Add Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Medical Record</DialogTitle>
                      <DialogDescription>Add a diagnosis, prescription, or test report.</DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium'>Record Type</label>
                        <Select value={recordForm.type} onValueChange={(v) => setRecordForm({ ...recordForm, type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value='diagnosis'>Diagnosis</SelectItem>
                            <SelectItem value='prescription'>Prescription</SelectItem>
                            <SelectItem value='test_report'>Test Report</SelectItem>
                            <SelectItem value='other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium'>Title</label>
                        <Input placeholder='e.g., Blood Test Results' value={recordForm.title} onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })} />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium'>Date</label>
                        <Input type='date' value={recordForm.recordDate} onChange={(e) => setRecordForm({ ...recordForm, recordDate: e.target.value })} />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium'>Description</label>
                        <Textarea placeholder='Add notes...' value={recordForm.description} onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })} rows={3} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant='outline' onClick={() => setRecordDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddRecord} disabled={submitting}>
                        {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}Add Record
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className='divide-y'>
                {patient.medicalRecords?.length > 0 ? (
                  patient.medicalRecords.map((record) => (
                    <div key={record.id} className='p-4 hover:bg-muted/50'>
                      <div className='flex items-start gap-3'>
                        {getRecordTypeIcon(record.type)}
                        <div>
                          <div className='flex items-center gap-2'>
                            <span className='text-foreground font-medium'>{record.title}</span>
                            <Badge variant='secondary' className='text-xs capitalize'>{record.type.replace('_', ' ')}</Badge>
                          </div>
                          <p className='text-muted-foreground text-sm mt-1'>
                            {new Date(record.recordDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          {record.description && <p className='text-muted-foreground text-sm mt-2'>{record.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='p-8 text-center'>
                    <FileText className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                    <p className='text-muted-foreground'>No medical records yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='logs' className='space-y-4'>
            <div className='bg-card border-border rounded-xl border'>
              <div className='border-b p-4'><h3 className='text-foreground font-semibold'>Recent Calls</h3></div>
              <div className='divide-y'>
                {patient.callLogs?.length > 0 ? (
                  patient.callLogs.map((log) => (
                    <div key={log.id} className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-3'>
                          {getStatusIcon(log.status)}
                          <div>
                            <div className='flex items-center gap-2'>
                              <span className='text-foreground font-medium'>
                                {new Date(log.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(log.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </span>
                              {getStatusBadge(log.status)}
                            </div>
                            {log.notes && <p className='text-muted-foreground mt-1 text-sm'>{log.notes}</p>}
                            <div className='mt-2 flex flex-wrap gap-1'>
                              {log.medications.map((med) => (<Badge key={med} variant='secondary' className='text-xs'>{med}</Badge>))}
                            </div>
                          </div>
                        </div>
                        {log.duration > 0 && <span className='text-muted-foreground text-sm'>Duration: {Math.floor(log.duration / 60)}:{(log.duration % 60).toString().padStart(2, '0')}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='p-8 text-center'><Phone className='h-8 w-8 text-muted-foreground mx-auto mb-2' /><p className='text-muted-foreground'>No call history yet</p></div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='profile' className='space-y-4'>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='bg-card border-border rounded-xl border p-6'>
                <h3 className='text-foreground mb-4 text-lg font-semibold'>Contact Information</h3>
                <dl className='space-y-4'>
                  <div><dt className='text-muted-foreground text-sm'>Phone Number</dt><dd className='text-foreground font-medium'>{patient.phone}</dd></div>
                  {patient.emergencyContact && <div><dt className='text-muted-foreground text-sm'>Emergency Contact</dt><dd className='text-foreground font-medium'>{patient.emergencyContact}</dd></div>}
                  {patient.emergencyPhone && <div><dt className='text-muted-foreground text-sm'>Emergency Phone</dt><dd className='text-foreground font-medium'>{patient.emergencyPhone}</dd></div>}
                </dl>
              </div>
              <div className='bg-card border-border rounded-xl border p-6'>
                <h3 className='text-foreground mb-4 text-lg font-semibold'>Medical Information</h3>
                <dl className='space-y-4'>
                  {patient.medicalConditions && <div><dt className='text-muted-foreground text-sm'>Medical Conditions</dt><dd className='text-foreground'>{patient.medicalConditions}</dd></div>}
                  {patient.notes && <div><dt className='text-muted-foreground text-sm'>Special Notes</dt><dd className='text-foreground'>{patient.notes}</dd></div>}
                  {!patient.medicalConditions && !patient.notes && <p className='text-muted-foreground'>No additional medical information</p>}
                </dl>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
