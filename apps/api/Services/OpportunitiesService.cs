using Voli.Api.Models;
using Voli.Api.Repositories;
using Voli.Api.DTOs;

namespace Voli.Api.Services;

public class OpportunitiesService : IOpportunitiesService
{
  private readonly IOpportunitiesRepository _repository;
  private readonly ILogger<OpportunitiesService> _logger;

  public OpportunitiesService(IOpportunitiesRepository repository, ILogger<OpportunitiesService> logger)
  {
    _repository = repository;
    _logger = logger;
    _logger.LogDebug("OpportunitiesService initialized");
  }

  public async Task<IEnumerable<Opportunity>> GetPublishedOpportunitiesAsync()
  {
    _logger.LogDebug("OpportunitiesService.GetPublishedOpportunitiesAsync - Starting");
    try
    {
      var opportunities = await _repository.GetAllPublishedAsync();
      _logger.LogInformation("OpportunitiesService.GetPublishedOpportunitiesAsync - Retrieved {Count} published opportunities", opportunities.Count());
      return opportunities;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "OpportunitiesService.GetPublishedOpportunitiesAsync - Error retrieving published opportunities");
      throw;
    }
  }

  public async Task<Opportunity?> GetOpportunityByIdAsync(string id)
  {
    _logger.LogDebug("OpportunitiesService.GetOpportunityByIdAsync - Starting for ID: {Id}", id);
    try
    {
      // Note: This is a limitation - we'd need organisationId as partition key
      // For now, using GetAllPublishedAsync and filtering
      var allOpportunities = await _repository.GetAllPublishedAsync();
      var opportunity = allOpportunities.FirstOrDefault(o => o.Id == id);

      if (opportunity == null)
      {
        _logger.LogWarning("OpportunitiesService.GetOpportunityByIdAsync - Opportunity not found: {Id}", id);
      }
      else
      {
        _logger.LogDebug("OpportunitiesService.GetOpportunityByIdAsync - Found opportunity: {Id}, Title: {Title}", id, opportunity.Title);
      }

      return opportunity;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "OpportunitiesService.GetOpportunityByIdAsync - Error retrieving opportunity: {Id}", id);
      throw;
    }
  }

  public async Task<Opportunity> CreateOpportunityAsync(string organisationId, CreateOpportunityDto dto)
  {
    _logger.LogInformation("OpportunitiesService.CreateOpportunityAsync - Creating opportunity for organisation: {OrganisationId}, Title: {Title}",
        organisationId, dto.Title);
    try
    {
      var opportunity = new Opportunity
      {
        Id = Guid.NewGuid().ToString(),
        OrganisationId = organisationId,
        Title = dto.Title,
        Description = dto.Description,
        Location = dto.Location,
        Skills = dto.Skills,
        CauseAreas = dto.CauseAreas,
        TimeCommitment = dto.TimeCommitment,
        Status = "draft"
      };

      var created = await _repository.CreateAsync(opportunity);
      _logger.LogInformation("OpportunitiesService.CreateOpportunityAsync - Created opportunity: {Id}, Organisation: {OrganisationId}",
          created.Id, organisationId);
      return created;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "OpportunitiesService.CreateOpportunityAsync - Error creating opportunity for organisation: {OrganisationId}",
          organisationId);
      throw;
    }
  }

  public async Task<Opportunity?> UpdateOpportunityAsync(string id, string organisationId, UpdateOpportunityDto dto)
  {
    _logger.LogInformation("OpportunitiesService.UpdateOpportunityAsync - Updating opportunity: {Id}, Organisation: {OrganisationId}",
        id, organisationId);
    try
    {
      var opportunity = await _repository.GetByIdAsync(id, organisationId);
      if (opportunity == null)
      {
        _logger.LogWarning("OpportunitiesService.UpdateOpportunityAsync - Opportunity not found or access denied: {Id}, Organisation: {OrganisationId}",
            id, organisationId);
        return null;
      }

      // Update fields if provided
      if (!string.IsNullOrEmpty(dto.Title))
      {
        _logger.LogDebug("OpportunitiesService.UpdateOpportunityAsync - Updating title: {OldTitle} -> {NewTitle}",
            opportunity.Title, dto.Title);
        opportunity.Title = dto.Title;
      }
      if (!string.IsNullOrEmpty(dto.Description))
        opportunity.Description = dto.Description;
      if (!string.IsNullOrEmpty(dto.Location))
        opportunity.Location = dto.Location;
      if (dto.Skills != null)
        opportunity.Skills = dto.Skills;
      if (dto.CauseAreas != null)
        opportunity.CauseAreas = dto.CauseAreas;
      if (!string.IsNullOrEmpty(dto.TimeCommitment))
        opportunity.TimeCommitment = dto.TimeCommitment;
      if (!string.IsNullOrEmpty(dto.Status))
      {
        _logger.LogDebug("OpportunitiesService.UpdateOpportunityAsync - Updating status: {OldStatus} -> {NewStatus}",
            opportunity.Status, dto.Status);
        opportunity.Status = dto.Status;
      }

      var updated = await _repository.UpdateAsync(opportunity);
      _logger.LogInformation("OpportunitiesService.UpdateOpportunityAsync - Updated opportunity: {Id}, Organisation: {OrganisationId}",
          updated.Id, organisationId);
      return updated;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "OpportunitiesService.UpdateOpportunityAsync - Error updating opportunity: {Id}, Organisation: {OrganisationId}",
          id, organisationId);
      throw;
    }
  }
}
