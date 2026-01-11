using Microsoft.Extensions.Logging;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class OrganisationsRepository : BaseRepository<Organisation>, IOrganisationsRepository
{
  public OrganisationsRepository(CosmosClientWrapper cosmosClientWrapper, ILogger<OrganisationsRepository> logger)
      : base(cosmosClientWrapper, "organisations", "/id", logger)
  {
  }

  protected override string GetPartitionKeyValue(Organisation item)
  {
    return item.Id;
  }
}
