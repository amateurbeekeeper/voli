using Microsoft.Azure.Cosmos;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public class UsersRepository : BaseRepository<User>, IUsersRepository
{
    public UsersRepository(CosmosClientWrapper cosmosClientWrapper)
        : base(cosmosClientWrapper, "users", "/id")
    {
    }

    protected override string GetPartitionKeyValue(User item) => item.Id;

    public async Task<User?> GetByEmailAsync(string email)
    {
        var container = await GetContainerAsync();
        var query = new QueryDefinition("SELECT * FROM c WHERE c.email = @email")
            .WithParameter("@email", email);

        var iterator = container.GetItemQueryIterator<User>(query);
        
        if (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            return response.FirstOrDefault();
        }

        return null;
    }
}

