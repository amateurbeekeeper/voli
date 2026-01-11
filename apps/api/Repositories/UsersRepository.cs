using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Voli.Api.Data;
using Models = Voli.Api.Models;

namespace Voli.Api.Repositories;

public class UsersRepository : BaseRepository<Models.User>, IUsersRepository
{
  public UsersRepository(CosmosClientWrapper cosmosClientWrapper, ILogger<UsersRepository> logger)
      : base(cosmosClientWrapper, "users", "/id", logger)
  {
  }

  protected override string GetPartitionKeyValue(Models.User item)
  {
    return item.Id;
  }

  public async Task<Models.User?> GetByEmailAsync(string email)
  {
    var container = await GetContainerAsync();
    var query = new QueryDefinition("SELECT * FROM c WHERE c.email = @email")
        .WithParameter("@email", email);

    var iterator = container.GetItemQueryIterator<Models.User>(query);

    if (iterator.HasMoreResults)
    {
      var response = await iterator.ReadNextAsync();
      return response.FirstOrDefault();
    }

    return null;
  }
}
