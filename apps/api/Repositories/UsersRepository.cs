using Microsoft.Extensions.Logging;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class UsersRepository : BaseRepository<User>, IUsersRepository
{
    public UsersRepository(CosmosClientWrapper cosmosClientWrapper, ILogger<UsersRepository> logger)
        : base(cosmosClientWrapper, "users", "/id", logger)
    {
    }

    protected override string GetPartitionKeyValue(User item)
    {
        return item.Id;
    }
}
