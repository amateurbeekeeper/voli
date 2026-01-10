using Voli.Api.DTOs;
using Voli.Api.Models;
using Voli.Api.Repositories;

namespace Voli.Api.Services;

public class HoursLogsService : IHoursLogsService
{
    private readonly IHoursLogsRepository _repository;

    public HoursLogsService(IHoursLogsRepository repository)
    {
        _repository = repository;
    }

    public async Task<HoursLog> CreateHoursLogAsync(string studentUserId, CreateHoursLogDto dto)
    {
        var hoursLog = new HoursLog
        {
            OrganisationId = dto.OrganisationId,
            OpportunityId = dto.OpportunityId,
            StudentUserId = studentUserId,
            Date = dto.Date,
            Minutes = dto.Minutes,
            Notes = dto.Notes,
            Status = "submitted"
        };

        return await _repository.CreateAsync(hoursLog);
    }

    public async Task<IEnumerable<HoursLog>> GetHoursLogsByOrganisationIdAsync(string organisationId)
    {
        return await _repository.GetByOrganisationIdAsync(organisationId);
    }

    public async Task<HoursLog?> ApproveHoursLogAsync(string id, string organisationId, string reviewedByUserId)
    {
        var hoursLog = await _repository.GetByIdAsync(id, organisationId);
        if (hoursLog == null)
            return null;

        hoursLog.Status = "approved";
        hoursLog.ReviewedByUserId = reviewedByUserId;
        return await _repository.UpdateAsync(hoursLog);
    }

    public async Task<HoursLog?> RejectHoursLogAsync(string id, string organisationId, string reviewedByUserId)
    {
        var hoursLog = await _repository.GetByIdAsync(id, organisationId);
        if (hoursLog == null)
            return null;

        hoursLog.Status = "rejected";
        hoursLog.ReviewedByUserId = reviewedByUserId;
        return await _repository.UpdateAsync(hoursLog);
    }
}

