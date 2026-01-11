import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Hero,
  Container,
  Separator,
} from '@voli/ui';
import Link from 'next/link';
import { Heart, Clock, Users, TrendingUp } from 'lucide-react';

export default function Index() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Make a Difference Together"
        description="Connect with meaningful volunteer opportunities that match your interests. Track your impact, build your community, and create change."
        badge={<Badge variant="outline">Join 1,000+ Volunteers</Badge>}
        actions={
          <>
            <Button size="lg" asChild>
              <Link href="/opportunities">Browse Opportunities</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </>
        }
        className="bg-gradient-to-b from-background to-muted/20"
      />

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to volunteer
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover opportunities, track your hours, and measure your impact all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Find Opportunities</CardTitle>
                <CardDescription>
                  Browse hundreds of volunteer opportunities tailored to your interests and skills.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Track Hours</CardTitle>
                <CardDescription>
                  Log your volunteer hours and maintain a record of all your community service.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Build Community</CardTitle>
                <CardDescription>
                  Connect with like-minded volunteers and organizations in your area.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Measure Impact</CardTitle>
                <CardDescription>
                  See the difference you're making with detailed analytics and impact reports.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Container>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <Container size="md">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of volunteers making a difference in their communities.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/components">View Components</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
