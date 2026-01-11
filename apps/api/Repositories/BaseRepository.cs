using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Voli.Api.Data;
using Voli.Api.Models;

namespace Voli.Api.Repositories;

public abstract class BaseRepository<T> : IRepository<T> where T : BaseDocument
{
  protected readonly CosmosClientWrapper _cosmosClientWrapper;
  protected readonly string _containerName;
  protected readonly string _partitionKeyPath;
  protected readonly ILogger<BaseRepository<T>> _logger;

  protected BaseRepository(
      CosmosClientWrapper cosmosClientWrapper,
      string containerName,
      string partitionKeyPath,
      ILogger<BaseRepository<T>> logger)
  {
    _cosmosClientWrapper = cosmosClientWrapper;
    _containerName = containerName;
    _partitionKeyPath = partitionKeyPath;
    _logger = logger;
    _logger.LogDebug("BaseRepository<{Type}> initialized for container: {Container}, partitionKey: {PartitionKey}",
        typeof(T).Name, containerName, partitionKeyPath);
  }

  protected async Task<Container> GetContainerAsync()
  {
    _logger.LogTrace("BaseRepository<{Type}>.GetContainerAsync - Getting container: {Container}",
        typeof(T).Name, _containerName);
    try
    {
      var container = await _cosmosClientWrapper.GetOrCreateContainerAsync(_containerName, _partitionKeyPath);
      _logger.LogTrace("BaseRepository<{Type}>.GetContainerAsync - Container retrieved: {Container}",
          typeof(T).Name, _containerName);
      return container;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "BaseRepository<{Type}>.GetContainerAsync - Error getting container: {Container}",
          typeof(T).Name, _containerName);
      throw;
    }
  }

  public virtual async Task<T?> GetByIdAsync(string id, string partitionKey)
  {
    _logger.LogDebug("BaseRepository<{Type}>.GetByIdAsync - Starting: Id={Id}, PartitionKey={PartitionKey}",
        typeof(T).Name, id, partitionKey);
    try
    {
      var container = await GetContainerAsync();
      var response = await container.ReadItemAsync<T>(id, new PartitionKey(partitionKey));
      _logger.LogInformation("BaseRepository<{Type}>.GetByIdAsync - Retrieved: Id={Id}, PartitionKey={PartitionKey}",
          typeof(T).Name, id, partitionKey);
      return response.Resource;
    }
    catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
    {
      _logger.LogWarning("BaseRepository<{Type}>.GetByIdAsync - Not found: Id={Id}, PartitionKey={PartitionKey}",
          typeof(T).Name, id, partitionKey);
      return null;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "BaseRepository<{Type}>.GetByIdAsync - Error: Id={Id}, PartitionKey={PartitionKey}",
          typeof(T).Name, id, partitionKey);
      throw;
    }
  }

  public virtual async Task<IEnumerable<T>> GetAllAsync(string partitionKey)
  {
    _logger.LogDebug("BaseRepository<{Type}>.GetAllAsync - Starting: PartitionKey={PartitionKey}",
        typeof(T).Name, partitionKey);
    try
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

      _logger.LogInformation("BaseRepository<{Type}>.GetAllAsync - Retrieved {Count} items: PartitionKey={PartitionKey}",
          typeof(T).Name, results.Count, partitionKey);
      return results;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "BaseRepository<{Type}>.GetAllAsync - Error: PartitionKey={PartitionKey}",
          typeof(T).Name, partitionKey);
      throw;
    }
  }

  public virtual async Task<IEnumerable<T>> GetAllAsync()
  {
    _logger.LogDebug("BaseRepository<{Type}>.GetAllAsync - Starting (all items)", typeof(T).Name);
    try
    {
      var container = await GetContainerAsync();
      var query = new QueryDefinition("SELECT * FROM c");

      var iterator = container.GetItemQueryIterator<T>(query);
      var results = new List<T>();

      while (iterator.HasMoreResults)
      {
        var response = await iterator.ReadNextAsync();
        results.AddRange(response);
      }

      _logger.LogInformation("BaseRepository<{Type}>.GetAllAsync - Retrieved {Count} items (all)", typeof(T).Name, results.Count);
      return results;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "BaseRepository<{Type}>.GetAllAsync - Error (all items)", typeof(T).Name);
      throw;
    }
  }

  public virtual async Task<T> CreateAsync(T item)
  {
    _logger.LogDebug("BaseRepository<{Type}>.CreateAsync - Starting: Id={Id}", typeof(T).Name, item.Id);
    try
    {
      item.CreatedAt = DateTime.UtcNow;
      item.UpdatedAt = DateTime.UtcNow;

      var container = await GetContainerAsync();
      var response = await container.CreateItemAsync(item);
      _logger.LogInformation("BaseRepository<{Type}>.CreateAsync - Created: Id={Id}", typeof(T).Name, item.Id);
      return response.Resource;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "BaseRepository<{Type}>.CreateAsync - Error: Id={Id}", typeof(T).Name, item.Id);
      throw;
    }
  }

  public virtual async Task<T> UpdateAsync(T item)
  {
    _logger.LogDebug("BaseRepository<{Type}>.UpdateAsync - Starting: Id={Id}", typeof(T).Name, item.Id);
    try
    {
      item.UpdatedAt = DateTime.UtcNow;

      var container = await GetContainerAsync();
      var partitionKeyValue = GetPartitionKeyValue(item);
      var response = await container.ReplaceItemAsync(item, item.Id, new PartitionKey(partitionKeyValue));
      _logger.LogInformation("BaseRepository<{Type}>.UpdateAsync - Updated: Id={Id}", typeof(T).Name, item.Id);
      return response.Resource;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "BaseRepository<{Type}>.UpdateAsync - Error: Id={Id}", typeof(T).Name, item.Id);
      throw;
    }
  }

  public virtual async Task DeleteAsync(string id, string partitionKey)
  {
    _logger.LogDebug("BaseRepository<{Type}>.DeleteAsync - Starting: Id={Id}, PartitionKey={PartitionKey}",
        typeof(T).Name, id, partitionKey);
    try
    {
      var container = await GetContainerAsync();
      await container.DeleteItemAsync<T>(id, new PartitionKey(partitionKey));
      _logger.LogInformation("BaseRepository<{Type}>.DeleteAsync - Deleted: Id={Id}, PartitionKey={PartitionKey}",
          typeof(T).Name, id, partitionKey);
    }
    catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
    {
      _logger.LogWarning("BaseRepository<{Type}>.DeleteAsync - Not found: Id={Id}, PartitionKey={PartitionKey}",
          typeof(T).Name, id, partitionKey);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "BaseRepository<{Type}>.DeleteAsync - Error: Id={Id}, PartitionKey={PartitionKey}",
          typeof(T).Name, id, partitionKey);
      throw;
    }
  }

  protected abstract string GetPartitionKeyValue(T item);
}
