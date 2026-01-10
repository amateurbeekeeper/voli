using Voli.Api.DTOs;
using Voli.Api.Models;

namespace Voli.Api.Services;

public interface IHoursLogsService
{
    Task<HoursLog> CreateHoursLogAsync(string studentUserId, CreateHoursLogDto dto);
    Task<IEnumerable<HoursLog>> GetHoursLogsByOrganisationIdAsync(string organisationId);
    Task<HoursLog?> ApproveHoursLogAsync(string id, string organisationId, string reviewedByUserId);
    Task<HoursLog?> RejectHoursLogAsync(string id, string organisationId, string reviewedByUserId);
}

