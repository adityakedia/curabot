'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer } from '@/components/dashboard-modern/page-container';
import { PageHeader } from '@/components/dashboard-modern/page-header';
import { FormCard } from '@/components/dashboard-modern/form-card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(1, 'Patient name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  age: z.string().min(1, 'Age is required'),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  medicalConditions: z.string().optional(),
  notes: z.string().optional()
});

interface Medication {
  name: string;
  dosage: string;
  time: string;
}

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '08:00' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      age: '',
      emergencyContact: '',
      emergencyPhone: '',
      medicalConditions: '',
      notes: ''
    }
  });

  const addMedication = () => {
    if (newMed.name && newMed.dosage) {
      setMedications([...medications, newMed]);
      setNewMed({ name: '', dosage: '', time: '08:00' });
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (medications.length === 0) {
      toast.error('Please add at least one medication');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          medications
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create patient');
      }

      toast.success('Patient added successfully!');
      router.push('/dashboard/patients');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className='space-y-8'>
        {/* Page Header */}
        <PageHeader
          title='Add New Patient'
          description='Set up a new patient profile with their medications and call schedule'
        >
          <Link href='/dashboard/patients'>
            <Button variant='outline' className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back to Patients
            </Button>
          </Link>
        </PageHeader>

        {/* Form */}
        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Patient Information */}
          <FormCard
            title='Patient Information'
            description='Basic details about the patient'
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className='text-destructive'>*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., Margaret Johnson'
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number <span className='text-destructive'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder='+1 (555) 123-4567'
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='age'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age <span className='text-destructive'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='78'
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='border-t pt-6'>
                  <h4 className='text-foreground mb-4 font-medium'>Emergency Contact</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='emergencyContact'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Son, Daughter, etc.'
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='emergencyPhone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='+1 (555) 987-6543'
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='medicalConditions'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='e.g., Type 2 Diabetes, Hypertension, etc.'
                          disabled={loading}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List any relevant medical conditions
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Any special instructions or preferences...'
                          disabled={loading}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className='flex gap-4 pt-4'>
                  <Button
                    type='submit'
                    disabled={loading}
                    className='flex-1'
                  >
                    {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Add Patient
                  </Button>
                </div>
              </form>
            </Form>
          </FormCard>

          {/* Medications */}
          <FormCard
            title='Medications & Schedule'
            description='Add medications and set reminder times'
          >
            <div className='space-y-6'>
              {/* Add Medication Form */}
              <div className='space-y-4'>
                <div className='grid grid-cols-3 gap-3'>
                  <div>
                    <label className='text-foreground mb-2 block text-sm font-medium'>
                      Medication Name
                    </label>
                    <Input
                      placeholder='e.g., Metformin'
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className='text-foreground mb-2 block text-sm font-medium'>
                      Dosage
                    </label>
                    <Input
                      placeholder='e.g., 500mg'
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className='text-foreground mb-2 block text-sm font-medium'>
                      Time
                    </label>
                    <Input
                      type='time'
                      value={newMed.time}
                      onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  onClick={addMedication}
                  className='w-full'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Medication
                </Button>
              </div>

              {/* Medications List */}
              <div className='space-y-3'>
                <h4 className='text-foreground text-sm font-medium'>
                  Scheduled Medications ({medications.length})
                </h4>
                
                {medications.length === 0 ? (
                  <div className='bg-muted/50 rounded-lg border border-dashed p-6 text-center'>
                    <p className='text-muted-foreground text-sm'>
                      No medications added yet. Add at least one medication to schedule reminder calls.
                    </p>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    {medications.map((med, index) => (
                      <div
                        key={index}
                        className='bg-muted/50 flex items-center justify-between rounded-lg p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <Badge variant='secondary'>{med.time}</Badge>
                          <div>
                            <p className='text-foreground text-sm font-medium'>{med.name}</p>
                            <p className='text-muted-foreground text-xs'>{med.dosage}</p>
                          </div>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeMedication(index)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Call Settings Info */}
              <div className='bg-primary/5 rounded-lg p-4'>
                <h4 className='text-foreground mb-2 text-sm font-medium'>
                  How it works
                </h4>
                <ul className='text-muted-foreground space-y-1 text-sm'>
                  <li>• CuraBot will call at each scheduled medication time</li>
                  <li>• Calls include a friendly reminder and confirmation</li>
                  <li>• You'll receive notifications about call status</li>
                  <li>• Missed calls are automatically retried after 15 minutes</li>
                </ul>
              </div>
            </div>
          </FormCard>
        </div>
      </div>
    </PageContainer>
  );
}
