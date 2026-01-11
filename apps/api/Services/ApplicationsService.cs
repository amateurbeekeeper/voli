using Voli.Api.DTOs;
using Voli.Api.Models;
using Voli.Api.Repositories;

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
        Status = "submitted",
        Message = dto.Message
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
      var applications = await _repository.GetByOpportunityIdAsync(opportunityId);
      _logger.LogInformation("ApplicationsService.GetApplicationsByOpportunityIdAsync - Retrieved {Count} applications for opportunity: {OpportunityId}",
          applications.Count(), opportunityId);
      return applications;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "ApplicationsService.GetApplicationsByOpportunityIdAsync - Error retrieving applications for opportunity: {OpportunityId}",
          opportunityId);
      throw;
    }
  }

  public async Task<Application?> UpdateApplicationStatusAsync(string id, string opportunityId, UpdateApplicationStatusDto dto)
  {
    _logger.LogInformation("ApplicationsService.UpdateApplicationStatusAsync - Updating application: {Id}, Opportunity: {OpportunityId}, Status: {Status}",
        id, opportunityId, dto.Status);
    try
    {
      var application = await _repository.GetByIdAsync(id, opportunityId);
      if (application == null)
      {
        _logger.LogWarning("ApplicationsService.UpdateApplicationStatusAsync - Application not found: {Id}, Opportunity: {OpportunityId}",
            id, opportunityId);
        return null;
      }

      _logger.LogDebug("ApplicationsService.UpdateApplicationStatusAsync - Status change: {OldStatus} -> {NewStatus}",
          application.Status, dto.Status);
      application.Status = dto.Status;

      var updated = await _repository.UpdateAsync(application);
      _logger.LogInformation("ApplicationsService.UpdateApplicationStatusAsync - Updated application: {Id}, Status: {Status}",
          updated.Id, dto.Status);
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
