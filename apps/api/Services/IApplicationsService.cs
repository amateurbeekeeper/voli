using Voli.Api.DTOs;
using Voli.Api.Models;

namespace Voli.Api.Services;

public interface IApplicationsService
{
  Task<Application> CreateApplicationAsync(string studentUserId, CreateApplicationDto dto);
  Task<IEnumerable<Application>> GetApplicationsByOpportunityIdAsync(string opportunityId);
  Task<Application?> UpdateApplicationStatusAsync(string id, string opportunityId, UpdateApplicationStatusDto dto);
}

