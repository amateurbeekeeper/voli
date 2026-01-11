using Voli.Api.Models;

namespace Voli.Api.Repositories;

public interface IApplicationsRepository : IRepository<Application>
{
  Task<IEnumerable<Application>> GetByOpportunityIdAsync(string opportunityId);
  Task<IEnumerable<Application>> GetByStudentUserIdAsync(string studentUserId);
}

