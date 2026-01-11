using Voli.Api.Models;

namespace Voli.Api.Repositories;

public interface IHoursLogsRepository : IRepository<HoursLog>
{
  Task<IEnumerable<HoursLog>> GetByOrganisationIdAsync(string organisationId);
  Task<IEnumerable<HoursLog>> GetByStudentUserIdAsync(string studentUserId);
}

