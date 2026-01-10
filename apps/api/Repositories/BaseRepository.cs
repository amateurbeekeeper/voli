using Microsoft.Azure.Cosmos;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public abstract class BaseRepository<T> : IRepository<T> where T : BaseDocument
{
    protected readonly CosmosClientWrapper _cosmosClientWrapper;
    protected readonly string _containerName;
    protected readonly string _partitionKeyPath;

    protected BaseRepository(CosmosClientWrapper cosmosClientWrapper, string containerName, string partitionKeyPath)
    {
        _cosmosClientWrapper = cosmosClientWrapper;
        _containerName = containerName;
        _partitionKeyPath = partitionKeyPath;
    }

    protected async Task<Container> GetContainerAsync()
    {
        return await _cosmosClientWrapper.GetOrCreateContainerAsync(_containerName, _partitionKeyPath);
    }

    public virtual async Task<T?> GetByIdAsync(string id, string partitionKey)
    {
        try
        {
            var container = await GetContainerAsync();
            var response = await container.ReadItemAsync<T>(id, new PartitionKey(partitionKey));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(string partitionKey)
    {
        var container = await GetContainerAsync();
        var query = new QueryDefinition($"SELECT * FROM c WHERE c.{_partitionKeyPath.Replace("/", "")} = @partitionKey")
            .WithParameter("@partitionKey", partitionKey);

        var iterator = container.GetItemQueryIterator<T>(query);
        var results = new List<T>();

        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            results.AddRange(response);
        }

        return results;
    }

    public virtual async Task<T> CreateAsync(T item)
    {
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        var container = await GetContainerAsync();
        var response = await container.CreateItemAsync(item);
        return response.Resource;
    }

    public virtual async Task<T> UpdateAsync(T item)
    {
        item.UpdatedAt = DateTime.UtcNow;
        var container = await GetContainerAsync();
        var partitionKey = GetPartitionKeyValue(item);
        var response = await container.ReplaceItemAsync(item, item.Id, new PartitionKey(partitionKey));
        return response.Resource;
    }

    public virtual async Task DeleteAsync(string id, string partitionKey)
    {
        var container = await GetContainerAsync();
        await container.DeleteItemAsync<T>(id, new PartitionKey(partitionKey));
    }

    protected abstract string GetPartitionKeyValue(T item);
}

