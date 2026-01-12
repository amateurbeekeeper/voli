'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Container,
  Alert,
  AlertDescription,
  Label,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@voli/ui';
import Link from 'next/link';
import { useHoursLog } from '@/hooks/use-hours-log';
import { useOpportunities } from '@/hooks/use-opportunities';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function LogHoursPage() {
  const router = useRouter();
  const { opportunities } = useOpportunities();
  const { logHours, loading: submitting, error } = useHoursLog();
  const [opportunityId, setOpportunityId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  // Filter to only show opportunities the user has applied to
  // For MVP, we'll show all published opportunities
  const availableOpportunities = opportunities.filter((opp) => opp.status === 'published' || !opp.status);

  const selectedOpportunity = opportunities.find((opp) => opp.id === opportunityId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOpportunity) {
      return;
    }

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      return;
    }

    const response = await logHours({
      opportunityId,
      organisationId: selectedOpportunity.organisationId,
      date,
      minutes: Math.round(hoursNum * 60),
    });

    if (response.data) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  if (success) {
    return (
      <Container size="full" className="py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Hours Logged!</h2>
              <p className="text-muted-foreground">
                Your volunteer hours have been logged successfully. You&apos;ll be redirected to your dashboard shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="full" className="py-8 space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Log Volunteer Hours</h1>
          <p className="text-muted-foreground mt-2">
            Record the hours you&apos;ve volunteered
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hours Log Form</CardTitle>
            <CardDescription>
              Fill in the details of your volunteer work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="opportunity">Opportunity *</Label>
                <Select value={opportunityId} onValueChange={setOpportunityId}>
                  <SelectTrigger id="opportunity">
                    <SelectValue placeholder="Select an opportunity" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOpportunities.map((opp) => (
                      <SelectItem key={opp.id} value={opp.id}>
                        {opp.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select the opportunity you volunteered for
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Hours *</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g., 4.5"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter the number of hours you volunteered (e.g., 4.5 for 4 hours and 30 minutes)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you did during your volunteer work..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={submitting || !opportunityId || !date || !hours}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    'Log Hours'
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
