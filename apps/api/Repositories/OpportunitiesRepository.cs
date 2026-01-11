using Microsoft.Extensions.Logging;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class OpportunitiesRepository : BaseRepository<Opportunity>, IOpportunitiesRepository
{
    public OpportunitiesRepository(CosmosClientWrapper cosmosClientWrapper, ILogger<OpportunitiesRepository> logger)
        : base(cosmosClientWrapper, "opportunities", "/organisationId", logger)
    {
    }

    protected override string GetPartitionKeyValue(Opportunity item)
    {
        return item.OrganisationId;
    }
}
