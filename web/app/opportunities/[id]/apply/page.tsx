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
  Textarea,
  Label,
} from '@voli/ui';
import Link from 'next/link';
import { useOpportunity } from '@/hooks/use-opportunity';
import { useApplication } from '@/hooks/use-application';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params.id as string;
  const { opportunity, loading: opportunityLoading } = useOpportunity(opportunityId);
  const { submitApplication, loading: submitting, error } = useApplication();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await submitApplication({
      opportunityId,
      message: message || undefined,
    });

    if (response.data) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  if (opportunityLoading) {
    return (
      <Container size="full" className="py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (!opportunity) {
    return (
      <Container size="full" className="py-8">
        <Alert variant="destructive">
          <AlertDescription>Opportunity not found.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  if (success) {
    return (
      <Container size="full" className="py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Application Submitted!</h2>
              <p className="text-muted-foreground">
                Your application has been submitted successfully. You&apos;ll be redirected to your dashboard shortly.
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
        <Link href={`/opportunities/${opportunityId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunity
        </Link>
      </Button>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Apply for Opportunity</h1>
          <p className="text-muted-foreground mt-2">{opportunity.title}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Tell us why you&apos;re interested in this opportunity
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
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about yourself and why you're interested in this opportunity..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  This message will be sent to the organisation along with your application.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/opportunities/${opportunityId}`}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
