using Microsoft.Azure.Cosmos;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class HoursLogsRepository : BaseRepository<HoursLog>, IHoursLogsRepository
{
    public HoursLogsRepository(CosmosClientWrapper cosmosClientWrapper)
        : base(cosmosClientWrapper, "hoursLogs", "/organisationId")
    {
    }

    protected override string GetPartitionKeyValue(HoursLog item) => item.OrganisationId;

    public async Task<IEnumerable<HoursLog>> GetByOrganisationIdAsync(string organisationId)
    {
        return await GetAllAsync(organisationId);
    }

    public async Task<IEnumerable<HoursLog>> GetByStudentUserIdAsync(string studentUserId)
    {
        var container = await GetContainerAsync();
        var query = new QueryDefinition("SELECT * FROM c WHERE c.studentUserId = @studentUserId")
            .WithParameter("@studentUserId", studentUserId);

        var iterator = container.GetItemQueryIterator<HoursLog>(query);
        var results = new List<HoursLog>();

        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            results.AddRange(response);
        }

        return results;
    }
}

