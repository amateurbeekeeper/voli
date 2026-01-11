using Voli.Api.Models;
using Voli.Api.Repositories;
using Voli.Api.DTOs;

namespace Voli.Api.Services;

public class HoursLogsService : IHoursLogsService
{
    private readonly IHoursLogsRepository _repository;
    private readonly ILogger<HoursLogsService> _logger;

    public HoursLogsService(IHoursLogsRepository repository, ILogger<HoursLogsService> logger)
    {
        _repository = repository;
        _logger = logger;
        _logger.LogDebug("HoursLogsService initialized");
    }

    public async Task<HoursLog> CreateHoursLogAsync(string studentUserId, CreateHoursLogDto dto)
    {
        _logger.LogInformation("HoursLogsService.CreateHoursLogAsync - Creating hours log for student: {StudentUserId}, date: {Date}, minutes: {Minutes}", 
            studentUserId, dto.Date, dto.Minutes);
        try
        {
            var hoursLog = new HoursLog
            {
                Id = Guid.NewGuid().ToString(),
                StudentUserId = studentUserId,
                OpportunityId = dto.OpportunityId,
                OrganisationId = dto.OrganisationId,
                Date = dto.Date,
                Minutes = dto.Minutes,
                Notes = dto.Notes,
                Status = "pending"
            };

            var created = await _repository.CreateAsync(hoursLog);
            _logger.LogInformation("HoursLogsService.CreateHoursLogAsync - Created hours log: {Id}, Student: {StudentUserId}, Date: {Date}, Minutes: {Minutes}", 
                created.Id, studentUserId, dto.Date, dto.Minutes);
            return created;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "HoursLogsService.CreateHoursLogAsync - Error creating hours log for student: {StudentUserId}, opportunity: {OpportunityId}", 
                studentUserId, dto.OpportunityId);
            throw;
        }
    }

    public async Task<IEnumerable<HoursLog>> GetHoursLogsByOrganisationIdAsync(string organisationId)
    {
        _logger.LogDebug("HoursLogsService.GetHoursLogsByOrganisationIdAsync - Starting for organisation: {OrganisationId}", organisationId);
        try
        {
            var hoursLogs = await _repository.GetByOrganisationIdAsync(organisationId);
            _logger.LogInformation("HoursLogsService.GetHoursLogsByOrganisationIdAsync - Retrieved {Count} hours logs for organisation: {OrganisationId}", 
                hoursLogs.Count(), organisationId);
            return hoursLogs;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "HoursLogsService.GetHoursLogsByOrganisationIdAsync - Error retrieving hours logs for organisation: {OrganisationId}", 
                organisationId);
            throw;
        }
    }

    public async Task<HoursLog?> ApproveHoursLogAsync(string id, string organisationId, string reviewedByUserId)
    {
        _logger.LogInformation("HoursLogsService.ApproveHoursLogAsync - Approving hours log: {Id}, Organisation: {OrganisationId}, ReviewedBy: {ReviewedByUserId}", 
            id, organisationId, reviewedByUserId);
        try
        {
            var hoursLog = await _repository.GetByIdAsync(id, organisationId);
            if (hoursLog == null)
            {
                _logger.LogWarning("HoursLogsService.ApproveHoursLogAsync - Hours log not found: {Id}, Organisation: {OrganisationId}", 
                    id, organisationId);
                return null;
            }

            _logger.LogDebug("HoursLogsService.ApproveHoursLogAsync - Status change: {OldStatus} -> approved", hoursLog.Status);
            hoursLog.Status = "approved";
            hoursLog.ReviewedByUserId = reviewedByUserId;

            var updated = await _repository.UpdateAsync(hoursLog);
            _logger.LogInformation("HoursLogsService.ApproveHoursLogAsync - Approved hours log: {Id}, Organisation: {OrganisationId}, ReviewedBy: {ReviewedByUserId}", 
                updated.Id, organisationId, reviewedByUserId);
            return updated;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "HoursLogsService.ApproveHoursLogAsync - Error approving hours log: {Id}, Organisation: {OrganisationId}", 
                id, organisationId);
            throw;
        }
    }

    public async Task<HoursLog?> RejectHoursLogAsync(string id, string organisationId, string reviewedByUserId)
    {
        _logger.LogInformation("HoursLogsService.RejectHoursLogAsync - Rejecting hours log: {Id}, Organisation: {OrganisationId}, ReviewedBy: {ReviewedByUserId}", 
            id, organisationId, reviewedByUserId);
        try
        {
            var hoursLog = await _repository.GetByIdAsync(id, organisationId);
            if (hoursLog == null)
            {
                _logger.LogWarning("HoursLogsService.RejectHoursLogAsync - Hours log not found: {Id}, Organisation: {OrganisationId}", 
                    id, organisationId);
                return null;
            }

            _logger.LogDebug("HoursLogsService.RejectHoursLogAsync - Status change: {OldStatus} -> rejected", hoursLog.Status);
            hoursLog.Status = "rejected";
            hoursLog.ReviewedByUserId = reviewedByUserId;

            var updated = await _repository.UpdateAsync(hoursLog);
            _logger.LogInformation("HoursLogsService.RejectHoursLogAsync - Rejected hours log: {Id}, Organisation: {OrganisationId}, ReviewedBy: {ReviewedByUserId}", 
                updated.Id, organisationId, reviewedByUserId);
            return updated;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "HoursLogsService.RejectHoursLogAsync - Error rejecting hours log: {Id}, Organisation: {OrganisationId}", 
                id, organisationId);
            throw;
        }
    }
}
