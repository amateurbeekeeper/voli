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
  Input,
  Alert,
  AlertDescription,
} from '@voli/ui';
import Link from 'next/link';
import { useOpportunities } from '@/hooks/use-opportunities';
import { Search, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function OpportunitiesPage() {
  const { opportunities, loading, error } = useOpportunities();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOpportunities = opportunities.filter((opp) =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container size="full" className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Volunteer Opportunities</h1>
          <p className="text-muted-foreground mt-2">
            Find meaningful ways to give back to your community
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Opportunities Grid */}
      {!loading && !error && (
        <>
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No opportunities match your search.' : 'No opportunities available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOpportunities.map((opportunity) => (
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
                          <span>{opportunity.location}</span>
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
                      <Button asChild>
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
  );
}
