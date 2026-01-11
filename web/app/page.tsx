import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@voli/ui';
import Link from 'next/link';

export default function Index() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Voli</h1>
          <p className="text-xl text-gray-600 mb-6">
            A volunteer platform connecting students with meaningful opportunities
          </p>
          <div className="flex gap-3 mb-4">
            <Link href="/components">
              <Button variant="outline">View Component Showcase</Button>
            </Link>
            <Badge variant="secondary">Powered by Storybook UI</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Browse Opportunities</CardTitle>
              <CardDescription>
                Find volunteer opportunities that match your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Explore</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log Hours</CardTitle>
              <CardDescription>
                Track your volunteer hours and impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary">Log Hours</Button>
            </CardContent>
          </Card>
          </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Status Badges</h2>
          <div className="flex gap-2 flex-wrap">
            <Badge>Published</Badge>
            <Badge variant="secondary">Draft</Badge>
            <Badge variant="success">Approved</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="destructive">Rejected</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
