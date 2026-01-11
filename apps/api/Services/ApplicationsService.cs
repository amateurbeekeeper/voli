using Voli.Api.Models;
using Voli.Api.Repositories;
using Voli.Api.DTOs;

namespace Voli.Api.Services;

public class ApplicationsService : IApplicationsService
{
    private readonly IApplicationsRepository _repository;
    private readonly ILogger<ApplicationsService> _logger;

    public ApplicationsService(IApplicationsRepository repository, ILogger<ApplicationsService> logger)
    {
        _repository = repository;
        _logger = logger;
        _logger.LogDebug("ApplicationsService initialized");
    }

    public async Task<Application> CreateApplicationAsync(string studentUserId, CreateApplicationDto dto)
    {
        _logger.LogInformation("ApplicationsService.CreateApplicationAsync - Creating application for student: {StudentUserId}, opportunity: {OpportunityId}", 
            studentUserId, dto.OpportunityId);
        try
        {
            var application = new Application
            {
                Id = Guid.NewGuid().ToString(),
                StudentUserId = studentUserId,
                OpportunityId = dto.OpportunityId,
                Status = "pending",
                CoverLetter = dto.CoverLetter,
                Availability = dto.Availability
            };

            var created = await _repository.CreateAsync(application);
            _logger.LogInformation("ApplicationsService.CreateApplicationAsync - Created application: {Id}, Student: {StudentUserId}, Opportunity: {OpportunityId}", 
                created.Id, studentUserId, dto.OpportunityId);
            return created;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ApplicationsService.CreateApplicationAsync - Error creating application for student: {StudentUserId}, opportunity: {OpportunityId}", 
                studentUserId, dto.OpportunityId);
            throw;
        }
    }

    public async Task<IEnumerable<Application>> GetApplicationsByOpportunityIdAsync(string opportunityId)
    {
        _logger.LogDebug("ApplicationsService.GetApplicationsByOpportunityIdAsync - Starting for opportunity: {OpportunityId}", opportunityId);
        try
        {
            var allApplications = await _repository.GetAllAsync();
            var applications = allApplications.Where(a => a.OpportunityId == opportunityId).ToList();
            _logger.LogInformation("ApplicationsService.GetApplicationsByOpportunityIdAsync - Retrieved {Count} applications for opportunity: {OpportunityId}", 
                applications.Count, opportunityId);
            return applications;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ApplicationsService.GetApplicationsByOpportunityIdAsync - Error retrieving applications for opportunity: {OpportunityId}", 
                opportunityId);
            throw;
        }
    }

    public async Task<Application?> UpdateApplicationStatusAsync(string id, string opportunityId, string status)
    {
        _logger.LogInformation("ApplicationsService.UpdateApplicationStatusAsync - Updating application: {Id}, Opportunity: {OpportunityId}, Status: {Status}", 
            id, opportunityId, status);
        try
        {
            var allApplications = await _repository.GetAllAsync();
            var application = allApplications.FirstOrDefault(a => a.Id == id && a.OpportunityId == opportunityId);
            
            if (application == null)
            {
                _logger.LogWarning("ApplicationsService.UpdateApplicationStatusAsync - Application not found: {Id}, Opportunity: {OpportunityId}", 
                    id, opportunityId);
                return null;
            }

            _logger.LogDebug("ApplicationsService.UpdateApplicationStatusAsync - Status change: {OldStatus} -> {NewStatus}", 
                application.Status, status);
            application.Status = status;

            var updated = await _repository.UpdateAsync(application);
            _logger.LogInformation("ApplicationsService.UpdateApplicationStatusAsync - Updated application: {Id}, Status: {Status}", 
                updated.Id, status);
            return updated;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ApplicationsService.UpdateApplicationStatusAsync - Error updating application: {Id}, Opportunity: {OpportunityId}", 
                id, opportunityId);
            throw;
        }
    }
}
