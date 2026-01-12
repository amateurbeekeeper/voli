'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Container,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Alert,
  AlertDescription,
} from '@voli/ui';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { useOpportunities } from '@/hooks/use-opportunities';
import { useApplication } from '@/hooks/use-application';
import { useHoursLog } from '@/hooks/use-hours-log';
import { useState, useEffect } from 'react';
import {
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
  Loader2,
  Calendar,
} from 'lucide-react';
import { applicationsApi, hoursLogsApi, Opportunity } from '@/lib/api-client';
import { getApiBaseUrl, getAuthToken } from '@/lib/api';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const { opportunities } = useOpportunities();
  const [applications, setApplications] = useState<any[]>([]);
  const [hoursLogs, setHoursLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgOpportunities, setOrgOpportunities] = useState<Opportunity[]>([]);
  const [orgApplications, setOrgApplications] = useState<any[]>([]);
  const [orgHoursLogs, setOrgHoursLogs] = useState<any[]>([]);
  const { updateStatus } = useApplication();
  const { approveHours, rejectHours } = useHoursLog();

  const isVolunteer = user?.role === 'student' || user?.role === 'volunteer';
  const isOrganisation = user?.role === 'organisation' || user?.role === 'org';

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getAuthToken();
        const baseURL = getApiBaseUrl();
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        if (isVolunteer) {
          // For volunteers, we'd need endpoints to get their applications and hours
          // For now, we'll show a placeholder
          setApplications([]);
          setHoursLogs([]);
        } else if (isOrganisation && user.id) {
          // Fetch organisation's opportunities
          const oppsResponse = await fetch(`${baseURL}/api/opportunities`, {
            headers,
          });
          if (oppsResponse.ok) {
            const opps = await oppsResponse.json();
            setOrgOpportunities(opps.filter((o: Opportunity) => !o.isPublished || o.status === 'draft'));
          }

          // Fetch applications for organisation's opportunities
          // This would require iterating through opportunities
          setOrgApplications([]);

          // Fetch hours logs for organisation
          // This requires organisationId which we'd get from the user
          setOrgHoursLogs([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isVolunteer, isOrganisation]);

  if (userLoading || loading) {
    return (
      <Container size="full" className="py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="full" className="py-8">
        <Alert>
          <AlertDescription>
            Please{' '}
            <Link href="/login" className="underline">
              sign in
            </Link>{' '}
            to view your dashboard.
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="full" className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.name || user.email}!
          </p>
        </div>
        {isOrganisation && (
          <Button asChild>
            <Link href="/opportunities/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Opportunity
            </Link>
          </Button>
        )}
      </div>

      {isVolunteer && (
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="hours">My Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track the status of your volunteer applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't applied to any opportunities yet.
                    </p>
                    <Button asChild>
                      <Link href="/opportunities">
                        Browse Opportunities
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Opportunity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.opportunityTitle || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                app.status === 'accepted'
                                  ? 'default'
                                  : app.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/opportunities/${app.opportunityId}`}>
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Volunteer Hours</CardTitle>
                    <CardDescription>
                      Track your logged volunteer hours
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/hours/log">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Hours
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {hoursLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't logged any hours yet.
                    </p>
                    <Button asChild>
                      <Link href="/hours/log">
                        Log Your First Hours
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Opportunity</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hoursLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {new Date(log.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{log.opportunityTitle || 'Unknown'}</TableCell>
                          <TableCell>
                            {(log.minutes / 60).toFixed(1)} hours
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                log.status === 'approved'
                                  ? 'default'
                                  : log.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {isOrganisation && (
        <Tabs defaultValue="opportunities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="opportunities">My Opportunities</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="hours">Hours to Approve</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Opportunities</CardTitle>
                <CardDescription>
                  Manage your volunteer opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orgOpportunities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't created any opportunities yet.
                    </p>
                    <Button asChild>
                      <Link href="/opportunities/new">
                        Create Your First Opportunity
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgOpportunities.map((opp) => (
                        <TableRow key={opp.id}>
                          <TableCell className="font-medium">{opp.title}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{opp.status || 'Draft'}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(opp.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/opportunities/${opp.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>
                  Review and approve volunteer applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orgApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No pending applications at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orgApplications.map((app) => (
                      <Card key={app.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{app.studentName || 'Volunteer'}</p>
                              <p className="text-sm text-muted-foreground">
                                Applied for {app.opportunityTitle}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  const response = await updateStatus(app.id, app.opportunityId, {
                                    status: 'rejected',
                                  });
                                  if (response.data) {
                                    setOrgApplications((prev) =>
                                      prev.filter((a) => a.id !== app.id)
                                    );
                                  }
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  const response = await updateStatus(app.id, app.opportunityId, {
                                    status: 'accepted',
                                  });
                                  if (response.data) {
                                    setOrgApplications((prev) =>
                                      prev.filter((a) => a.id !== app.id)
                                    );
                                  }
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hours to Approve</CardTitle>
                <CardDescription>
                  Review and approve volunteer hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orgHoursLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No hours pending approval at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orgHoursLogs
                      .filter((log) => log.status === 'pending')
                      .map((log) => (
                        <Card key={log.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {(log.minutes / 60).toFixed(1)} hours
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {log.opportunityTitle || 'Unknown Opportunity'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {new Date(log.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    const response = await rejectHours(
                                      log.id,
                                      log.organisationId
                                    );
                                    if (response.data) {
                                      setOrgHoursLogs((prev) =>
                                        prev.filter((l) => l.id !== log.id)
                                      );
                                    }
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    const response = await approveHours(
                                      log.id,
                                      log.organisationId
                                    );
                                    if (response.data) {
                                      setOrgHoursLogs((prev) =>
                                        prev.filter((l) => l.id !== log.id)
                                      );
                                    }
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </Container>
  );
}
