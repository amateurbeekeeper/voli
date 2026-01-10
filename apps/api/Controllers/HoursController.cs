using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Voli.Api.DTOs;
using Voli.Api.Services;

namespace Voli.Api.Controllers;

[ApiController]
[Route("api/hours")]
public class HoursController : ControllerBase
{
    private readonly IHoursLogsService _service;

    public HoursController(IHoursLogsService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize(Policy = "Student")]
    public async Task<ActionResult<object>> CreateHoursLog([FromBody] CreateHoursLogDto dto)
    {
        var studentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(studentUserId))
            return Unauthorized("User ID not found in token");

        var hoursLog = await _service.CreateHoursLogAsync(studentUserId, dto);
        return CreatedAtAction(nameof(GetHoursLog), new { id = hoursLog.Id }, hoursLog);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<object>> GetHoursLog(string id)
    {
        // Implementation would check if user has access
        return Ok();
    }

    [HttpGet("organisations/{organisationId}")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<IEnumerable<object>>> GetHoursLogsByOrganisation(string organisationId)
    {
        var hoursLogs = await _service.GetHoursLogsByOrganisationIdAsync(organisationId);
        return Ok(hoursLogs);
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<object>> ApproveHoursLog(string id)
    {
        var organisationId = Request.Query["organisationId"].ToString();
        if (string.IsNullOrEmpty(organisationId))
            return BadRequest("organisationId query parameter is required");

        var reviewedByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(reviewedByUserId))
            return Unauthorized("User ID not found in token");

        var hoursLog = await _service.ApproveHoursLogAsync(id, organisationId, reviewedByUserId);
        if (hoursLog == null)
            return NotFound();

        return Ok(hoursLog);
    }

    [HttpPatch("{id}/reject")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<object>> RejectHoursLog(string id)
    {
        var organisationId = Request.Query["organisationId"].ToString();
        if (string.IsNullOrEmpty(organisationId))
            return BadRequest("organisationId query parameter is required");

        var reviewedByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(reviewedByUserId))
            return Unauthorized("User ID not found in token");

        var hoursLog = await _service.RejectHoursLogAsync(id, organisationId, reviewedByUserId);
        if (hoursLog == null)
            return NotFound();

        return Ok(hoursLog);
    }
}

