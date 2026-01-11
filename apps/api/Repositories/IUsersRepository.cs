using Voli.Api.Models;

namespace Voli.Api.Repositories;

public interface IUsersRepository : IRepository<User>
{
  Task<User?> GetByEmailAsync(string email);
}

