using Voli.Api.DTOs;
using Voli.Api.Models;

namespace Voli.Api.Services;

public interface IOpportunitiesService
{
  Task<IEnumerable<Opportunity>> GetPublishedOpportunitiesAsync();
  Task<Opportunity?> GetOpportunityByIdAsync(string id);
  Task<Opportunity> CreateOpportunityAsync(string organisationId, CreateOpportunityDto dto);
  Task<Opportunity?> UpdateOpportunityAsync(string id, string organisationId, UpdateOpportunityDto dto);
}

