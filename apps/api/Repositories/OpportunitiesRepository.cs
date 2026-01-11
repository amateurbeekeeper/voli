using Microsoft.Azure.Cosmos;
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

    public async Task<IEnumerable<Opportunity>> GetByOrganisationIdAsync(string organisationId)
    {
        return await GetAllAsync(organisationId);
    }

    public async Task<IEnumerable<Opportunity>> GetAllPublishedAsync()
    {
        var container = await GetContainerAsync();
        var query = new QueryDefinition("SELECT * FROM c WHERE c.status = @status")
            .WithParameter("@status", "published");

        var iterator = container.GetItemQueryIterator<Opportunity>(query);
        var results = new List<Opportunity>();

        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            results.AddRange(response);
        }

        return results;
    }
}
