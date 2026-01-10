using Voli.Api.Models;

namespace Voli.Api.Repositories;

public interface IOpportunitiesRepository : IRepository<Opportunity>
{
    Task<IEnumerable<Opportunity>> GetByOrganisationIdAsync(string organisationId);
    Task<IEnumerable<Opportunity>> GetAllPublishedAsync();
}

