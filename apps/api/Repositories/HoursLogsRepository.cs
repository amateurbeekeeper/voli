using Microsoft.Extensions.Logging;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class HoursLogsRepository : BaseRepository<HoursLog>, IHoursLogsRepository
{
    public HoursLogsRepository(CosmosClientWrapper cosmosClientWrapper, ILogger<HoursLogsRepository> logger)
        : base(cosmosClientWrapper, "hoursLogs", "/organisationId", logger)
    {
    }

    protected override string GetPartitionKeyValue(HoursLog item)
    {
        return item.OrganisationId;
    }
}
