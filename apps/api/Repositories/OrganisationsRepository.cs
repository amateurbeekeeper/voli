using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class OrganisationsRepository : BaseRepository<Organisation>, IOrganisationsRepository
{
    public OrganisationsRepository(CosmosClientWrapper cosmosClientWrapper)
        : base(cosmosClientWrapper, "organisations", "/id")
    {
    }

    protected override string GetPartitionKeyValue(Organisation item) => item.Id;
}

