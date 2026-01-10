using Microsoft.Azure.Cosmos;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class ApplicationsRepository : BaseRepository<Application>, IApplicationsRepository
{
    public ApplicationsRepository(CosmosClientWrapper cosmosClientWrapper)
        : base(cosmosClientWrapper, "applications", "/opportunityId")
    {
    }

    protected override string GetPartitionKeyValue(Application item) => item.OpportunityId;

    public async Task<IEnumerable<Application>> GetByOpportunityIdAsync(string opportunityId)
    {
        return await GetAllAsync(opportunityId);
    }

    public async Task<IEnumerable<Application>> GetByStudentUserIdAsync(string studentUserId)
    {
        var container = await GetContainerAsync();
        var query = new QueryDefinition("SELECT * FROM c WHERE c.studentUserId = @studentUserId")
            .WithParameter("@studentUserId", studentUserId);

        var iterator = container.GetItemQueryIterator<Application>(query);
        var results = new List<Application>();

        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            results.AddRange(response);
        }

        return results;
    }
}

