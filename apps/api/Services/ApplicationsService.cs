using Voli.Api.DTOs;
using Voli.Api.Models;
using Voli.Api.Repositories;

namespace Voli.Api.Services;

public class ApplicationsService : IApplicationsService
{
    private readonly IApplicationsRepository _repository;

    public ApplicationsService(IApplicationsRepository repository)
    {
        _repository = repository;
    }

    public async Task<Application> CreateApplicationAsync(string studentUserId, CreateApplicationDto dto)
    {
        var application = new Application
        {
            OpportunityId = dto.OpportunityId,
            StudentUserId = studentUserId,
            Message = dto.Message,
            Status = "submitted"
        };

        return await _repository.CreateAsync(application);
    }

    public async Task<IEnumerable<Application>> GetApplicationsByOpportunityIdAsync(string opportunityId)
    {
        return await _repository.GetByOpportunityIdAsync(opportunityId);
    }

    public async Task<Application?> UpdateApplicationStatusAsync(string id, string opportunityId, UpdateApplicationStatusDto dto)
    {
        var application = await _repository.GetByIdAsync(id, opportunityId);
        if (application == null)
            return null;

        application.Status = dto.Status;
        return await _repository.UpdateAsync(application);
    }
}

