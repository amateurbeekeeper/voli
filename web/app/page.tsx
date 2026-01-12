'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Container,
  Alert,
  AlertDescription,
} from '@voli/ui';
import Link from 'next/link';
import { useOpportunities } from '@/hooks/use-opportunities';
import { ArrowRight, MapPin, Clock, Loader2, Heart } from 'lucide-react';

export default function HomePage() {
  const { opportunities, loading, error } = useOpportunities();
  const featuredOpportunities = opportunities.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <Container size="full" className="py-24 space-y-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Make a Difference in Your Community
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with meaningful volunteer opportunities and track your impact
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/opportunities">
                  Browse Opportunities
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16">
        <Container size="full" className="space-y-8">
        <div className="flex items-center justify-between">
                <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Opportunities</h2>
              <p className="text-muted-foreground mt-2">
                Discover ways to give back to your community
              </p>
          </div>
            <Button variant="outline" asChild>
              <Link href="/opportunities">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
        </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
        </Alert>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && !error && (
            <>
              {featuredOpportunities.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No opportunities available at the moment. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{opportunity.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {opportunity.description}
                        </CardDescription>
              </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {opportunity.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{opportunity.location}</span>
                          </div>
                          )}
                          {opportunity.timeCommitment && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{opportunity.timeCommitment}</span>
                          </div>
                          )}
                          </div>
                        <div className="flex items-center justify-between pt-4">
                          <Badge variant="secondary">{opportunity.status || 'Active'}</Badge>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/opportunities/${opportunity.id}`}>
                              View Details
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                  </Button>
    </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-16">
        <Container size="full">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  Ready to Make an Impact?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join our community of volunteers and organisations working together to create positive change.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Sign Up as Volunteer
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/signup?type=organisation">
                      Sign Up as Organisation
                    </Link>
                  </Button>
                </div>
                </div>
              </CardContent>
            </Card>
      </Container>
      </section>
    </div>
  );
}
