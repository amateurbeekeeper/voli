namespace Voli.Api.Repositories;

public interface IRepository<T> where T : class
{
  Task<T?> GetByIdAsync(string id, string partitionKey);
  Task<IEnumerable<T>> GetAllAsync(string partitionKey);
  Task<T> CreateAsync(T item);
  Task<T> UpdateAsync(T item);
  Task DeleteAsync(string id, string partitionKey);
}

