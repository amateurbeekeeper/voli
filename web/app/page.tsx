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
        title="Volunteer Management Made Simple"
        description="The all-in-one platform for managing volunteers, tracking hours, and measuring impact. Trusted by organizations worldwide."
        badge={<Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Join 10,000+ Organizations</Badge>}
        actions={
          <>
            <Button size="lg" className="shadow-lg shadow-primary/25" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </>
        }
        className="bg-gradient-to-b from-background via-primary/5 to-background"
      />

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to manage volunteers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to recruit, manage, and engage volunteers. All in one beautiful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Recruit Volunteers</CardTitle>
                <CardDescription>
                  Post opportunities and attract qualified volunteers with our powerful recruitment tools.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Track Hours</CardTitle>
                <CardDescription>
                  Automated time tracking with real-time reporting and verification for accurate records.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Engage Volunteers</CardTitle>
                <CardDescription>
                  Build a thriving community with messaging, events, and recognition features.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Comprehensive dashboards and custom reports to measure and showcase your impact.
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
          <Card className="border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Ready to transform your volunteer program?
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Join thousands of organizations using Voli to manage their volunteers.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="shadow-lg shadow-primary/25" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
