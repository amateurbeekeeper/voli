using Microsoft.Extensions.Logging;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class ApplicationsRepository : BaseRepository<Application>, IApplicationsRepository
{
    public ApplicationsRepository(CosmosClientWrapper cosmosClientWrapper, ILogger<ApplicationsRepository> logger)
        : base(cosmosClientWrapper, "applications", "/opportunityId", logger)
    {
    }

    protected override string GetPartitionKeyValue(Application item)
    {
        return item.OpportunityId;
    }
}
