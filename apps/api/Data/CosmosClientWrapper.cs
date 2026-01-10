using Microsoft.Azure.Cosmos;

namespace Voli.Api.Data;

public class CosmosClientWrapper
{
    private readonly CosmosClient _client;
    private readonly string _databaseName;

    public CosmosClientWrapper(string endpoint, string key, string databaseName)
    {
        _client = new CosmosClient(endpoint, key);
        _databaseName = databaseName;
    }

    public async Task<Database> GetOrCreateDatabaseAsync()
    {
        return await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
    }

    public async Task<Container> GetOrCreateContainerAsync(string containerName, string partitionKeyPath)
    {
        var database = await GetOrCreateDatabaseAsync();
        return await database.CreateContainerIfNotExistsAsync(containerName, partitionKeyPath);
    }

    public CosmosClient Client => _client;

    public string DatabaseName => _databaseName;
}

