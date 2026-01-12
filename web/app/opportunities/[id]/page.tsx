'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Container,
  Alert,
  AlertDescription,
  Separator,
} from '@voli/ui';
import Link from 'next/link';
import { useOpportunity } from '@/hooks/use-opportunity';
import { useParams } from 'next/navigation';
import { MapPin, Clock, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

export default function OpportunityDetailPage() {
  const params = useParams();
  const opportunityId = params.id as string;
  const { opportunity, loading, error } = useOpportunity(opportunityId);
  const { user } = useUser();

  const isVolunteer = user?.role === 'student' || user?.role === 'volunteer';
  const canApply = isVolunteer && opportunity;

  return (
    <Container size="full" className="py-8 space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/opportunities">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Link>
      </Button>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Opportunity Details */}
      {!loading && !error && opportunity && (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">{opportunity.title}</h1>
              <Badge variant="secondary" className="text-sm">
                {opportunity.status || 'Active'}
              </Badge>
            </div>
            {canApply && (
              <Button asChild size="lg">
                <Link href={`/opportunities/${opportunity.id}/apply`}>
                  Apply Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About This Opportunity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {opportunity.description}
              </p>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                {opportunity.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{opportunity.location}</p>
                    </div>
                  </div>
                )}
                {opportunity.timeCommitment && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Time Commitment</p>
                      <p className="text-sm text-muted-foreground">{opportunity.timeCommitment}</p>
                    </div>
                  </div>
                )}
              </div>

              {opportunity.skills && opportunity.skills.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {opportunity.causeAreas && opportunity.causeAreas.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-2">Cause Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.causeAreas.map((cause, index) => (
                        <Badge key={index} variant="outline">
                          {cause}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {!isVolunteer && (
            <Alert>
              <AlertDescription>
                You need to be logged in as a volunteer to apply for this opportunity.{' '}
                <Link href="/login" className="underline">
                  Sign in
                </Link>{' '}
                or{' '}
                <Link href="/signup" className="underline">
                  create an account
                </Link>
                .
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </Container>
  );
}
