import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Alert,
  AlertDescription,
  AlertTitle,
  Separator,
  Container,
} from '@voli/ui';

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <Container size="xl" className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Component Showcase</h1>
          <p className="text-xl text-gray-600">
            All components from the Storybook UI library
          </p>
        </div>

        {/* Button Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                All available button variants and sizes from Storybook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Button Sizes</h3>
                <div className="flex items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">🔍</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Disabled States</h3>
                <div className="flex gap-4">
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" disabled>
                    Disabled Outline
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badge Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>
                Status and informational badges from Storybook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>
                  A simple card with header and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This is the card content area where you can place any content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>Card that includes a footer section</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Content goes here.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Card with interactive elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="success">Active</Badge>
                  <Badge>New</Badge>
                </div>
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Combined Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Combined Components</h2>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Opportunity Card</CardTitle>
                  <CardDescription>Example combining multiple components</CardDescription>
                </div>
                <Badge variant="success">Published</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                This demonstrates how to combine Card, Badge, and Button components
                together to create more complex UI patterns used in the Voli platform.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge>Volunteer</Badge>
                <Badge variant="secondary">Education</Badge>
                <Badge variant="outline">Remote</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">Learn More</Button>
              <Button>Apply Now</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Input and Form Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Form Components</h2>
          <Card>
            <CardHeader>
              <CardTitle>Input Fields</CardTitle>
              <CardDescription>
                Text inputs with labels for forms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled Input</Label>
                <Input id="disabled" placeholder="This is disabled" disabled />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Alert Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Alerts</h2>
          <div className="space-y-4">
            <Alert>
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your application has been submitted successfully. We&apos;ll review it and get back to you soon.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was an error processing your request. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Separator */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Separator</h2>
          <Card>
            <CardHeader>
              <CardTitle>Visual Separator</CardTitle>
              <CardDescription>Horizontal and vertical dividers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Above</p>
                  <Separator />
                  <p className="text-sm text-gray-600 mt-2">Below</p>
                </div>
                <div className="flex items-center gap-4 h-20">
                  <span className="text-sm">Left</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm">Right</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Usage Information */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Using Components in Your Pages</CardTitle>
              <CardDescription>
                All components are imported from @voli/ui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{`import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Alert,
  AlertDescription,
  AlertTitle,
  Separator,
} from '@voli/ui';`}</pre>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                View all component stories and documentation in Storybook by running:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm mt-2">
                <code>npx nx storybook ui</code>
              </div>
            </CardContent>
          </Card>
        </section>
      </Container>
    </div>
  );
}
