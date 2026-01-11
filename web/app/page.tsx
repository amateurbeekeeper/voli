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
  Separator,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@voli/ui';
import Link from 'next/link';
import {
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  ArrowRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Bell,
  Settings,
  Activity,
  Award,
  Target,
} from 'lucide-react';

export default function Index() {
  return (
    <TooltipProvider>
      <Container size="full" className="py-8 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
                <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" asChild>
              <Link href="/opportunities/new">
                New Opportunity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={75} className="h-2 flex-1" />
                <span className="text-xs font-medium text-green-600">+12%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8,542</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={85} className="h-2 flex-1" />
                <span className="text-xs font-medium text-green-600">+23%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">12 pending</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">8 approved this week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+18.2%</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={82} className="h-2 flex-1" />
                <Award className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Over last 30 days</p>
            </CardContent>
          </Card>
          </div>

        {/* Alert Section */}
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            You have 5 pending volunteer applications that need review.
            <Button variant="link" size="sm" className="ml-2 h-auto p-0">
              Review now <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </AlertDescription>
        </Alert>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Activity Feed */}
              <Card className="col-span-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest volunteer submissions and updates</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'John Doe', action: 'applied for', opportunity: 'Community Garden Cleanup', time: '2h ago', status: 'new' },
                      { name: 'Jane Smith', action: 'completed', opportunity: 'Beach Cleanup', time: '4h ago', status: 'completed' },
                      { name: 'Mike Johnson', action: 'applied for', opportunity: 'Food Bank Assistance', time: '6h ago', status: 'pending' },
                      { name: 'Sarah Wilson', action: 'logged', opportunity: '8 hours', time: '1d ago', status: 'logged' },
                      { name: 'Tom Brown', action: 'applied for', opportunity: 'Mentoring Program', time: '1d ago', status: 'new' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {activity.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{activity.name}</p>
                            <span className="text-sm text-muted-foreground">{activity.action}</span>
                            <span className="text-sm font-medium">{activity.opportunity}</span>
                            <Badge variant={activity.status === 'new' ? 'default' : 'secondary'} className="ml-auto text-xs">
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats Sidebar */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>This week's metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Goal Completion</span>
                      <span className="font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Pending Applications</span>
                      </div>
                      <Badge variant="warning">5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Approved This Week</span>
                      </div>
                      <Badge variant="success">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Opportunities</span>
                      </div>
                      <span className="font-medium">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg Hours/Volunteer</span>
                      </div>
                      <span className="font-medium">6.9 hrs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Opportunities</CardTitle>
                    <CardDescription>Manage your volunteer opportunities</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opportunity</TableHead>
                      <TableHead>Volunteers</TableHead>
                      <TableHead>Hours Logged</TableHead>
                      <TableHead>Next Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'Community Garden Cleanup', volunteers: 24, hours: 120, nextEvent: 'Dec 21', status: 'active' },
                      { name: 'Beach Cleanup Initiative', volunteers: 18, hours: 96, nextEvent: 'Dec 23', status: 'active' },
                      { name: 'Food Bank Assistance', volunteers: 32, hours: 180, nextEvent: 'Dec 20', status: 'active' },
                      { name: 'Mentoring Program', volunteers: 12, hours: 48, nextEvent: 'Dec 25', status: 'active' },
                      { name: 'Homeless Shelter Support', volunteers: 28, hours: 150, nextEvent: 'Dec 22', status: 'active' },
                    ].map((opp, i) => (
                      <TableRow key={i} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{opp.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {opp.volunteers}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {opp.hours}h
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {opp.nextEvent}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">{opp.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Review and approve volunteer applications</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', email: 'john@example.com', opportunity: 'Community Garden Cleanup', time: '3h ago', avatar: 'JD' },
                    { name: 'Jane Smith', email: 'jane@example.com', opportunity: 'Beach Cleanup', time: '5h ago', avatar: 'JS' },
                    { name: 'Mike Johnson', email: 'mike@example.com', opportunity: 'Food Bank Assistance', time: '1d ago', avatar: 'MJ' },
                  ].map((app, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {app.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold">{app.name}</h4>
                                <Badge variant="outline" className="text-xs">New</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{app.email}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Applied for <span className="font-medium">{app.opportunity}</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{app.time}</p>
          </div>
        </div>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Application</TooltipContent>
                            </Tooltip>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              Decline
                            </Button>
                            <Button size="sm">Approve</Button>
      </div>
    </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </TooltipProvider>
  );
}
