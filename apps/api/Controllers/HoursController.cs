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
    private readonly ILogger<HoursController> _logger;

    public HoursController(IHoursLogsService service, ILogger<HoursController> logger)
    {
        _service = service;
        _logger = logger;
        _logger.LogDebug("HoursController initialized");
    }

    [HttpPost]
    [Authorize(Policy = "Student")]
    public async Task<ActionResult<object>> CreateHoursLog([FromBody] CreateHoursLogDto dto)
    {
        var studentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("POST /api/hours - Creating hours log for student {StudentUserId}, opportunity {OpportunityId}, organisation {OrganisationId}", 
            studentUserId, dto.OpportunityId, dto.OrganisationId);
        
        if (string.IsNullOrEmpty(studentUserId))
        {
            _logger.LogWarning("POST /api/hours - User ID not found in token");
            return Unauthorized("User ID not found in token");
        }

        try
        {
            _logger.LogDebug("POST /api/hours - Request body: Date={Date}, Minutes={Minutes}, OpportunityId={OpportunityId}, OrganisationId={OrganisationId}", 
                dto.Date, dto.Minutes, dto.OpportunityId, dto.OrganisationId);
            
            var hoursLog = await _service.CreateHoursLogAsync(studentUserId, dto);
            
            _logger.LogInformation("POST /api/hours - Successfully created hours log {HoursLogId} for student {StudentUserId}, date {Date}, minutes {Minutes}", 
                hoursLog.Id, studentUserId, dto.Date, dto.Minutes);
            
            return CreatedAtAction(nameof(GetHoursLog), new { id = hoursLog.Id }, hoursLog);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "POST /api/hours - Error creating hours log for student {StudentUserId}, opportunity {OpportunityId}", 
                studentUserId, dto.OpportunityId);
            return StatusCode(500, "An error occurred while creating the hours log");
        }
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<object>> GetHoursLog(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("GET /api/hours/{Id} - Fetching hours log for user {UserId}", id, userId);
        
        try
        {
            // Implementation would check if user has access
            _logger.LogWarning("GET /api/hours/{Id} - GetHoursLog not yet implemented", id);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/hours/{Id} - Error fetching hours log for user {UserId}", id, userId);
            return StatusCode(500, "An error occurred while fetching the hours log");
        }
    }

    [HttpGet("organisations/{organisationId}")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<IEnumerable<object>>> GetHoursLogsByOrganisation(string organisationId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("GET /api/hours/organisations/{OrganisationId} - Fetching hours logs for organisation {OrganisationId} by user {UserId}", 
            organisationId, organisationId, userId);
        
        try
        {
            var hoursLogs = await _service.GetHoursLogsByOrganisationIdAsync(organisationId);
            _logger.LogInformation("GET /api/hours/organisations/{OrganisationId} - Successfully retrieved {Count} hours logs for organisation {OrganisationId}", 
                organisationId, hoursLogs.Count(), organisationId);
            return Ok(hoursLogs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/hours/organisations/{OrganisationId} - Error fetching hours logs for organisation {OrganisationId}", 
                organisationId, organisationId);
            return StatusCode(500, "An error occurred while fetching hours logs");
        }
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<object>> ApproveHoursLog(string id, [FromQuery] string organisationId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("PATCH /api/hours/{Id}/approve - Approving hours log for organisation {OrganisationId} by user {UserId}", 
            id, organisationId, userId);
        
        if (string.IsNullOrEmpty(organisationId))
        {
            _logger.LogWarning("PATCH /api/hours/{Id}/approve - Missing organisationId query parameter", id);
            return BadRequest("organisationId query parameter is required");
        }

        try
        {
            var hoursLog = await _service.ApproveHoursLogAsync(id, organisationId, userId);
            
            if (hoursLog == null)
            {
                _logger.LogWarning("PATCH /api/hours/{Id}/approve - Hours log not found or access denied for organisation {OrganisationId}", 
                    id, organisationId);
                return NotFound();
            }

            _logger.LogInformation("PATCH /api/hours/{Id}/approve - Successfully approved hours log for organisation {OrganisationId} by user {UserId}", 
                id, organisationId, userId);
            return Ok(hoursLog);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PATCH /api/hours/{Id}/approve - Error approving hours log for organisation {OrganisationId}", 
                id, organisationId);
            return StatusCode(500, "An error occurred while approving the hours log");
        }
    }

    [HttpPatch("{id}/reject")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<object>> RejectHoursLog(string id, [FromQuery] string organisationId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("PATCH /api/hours/{Id}/reject - Rejecting hours log for organisation {OrganisationId} by user {UserId}", 
            id, organisationId, userId);
        
        if (string.IsNullOrEmpty(organisationId))
        {
            _logger.LogWarning("PATCH /api/hours/{Id}/reject - Missing organisationId query parameter", id);
            return BadRequest("organisationId query parameter is required");
        }

        try
        {
            var hoursLog = await _service.RejectHoursLogAsync(id, organisationId, userId);
            
            if (hoursLog == null)
            {
                _logger.LogWarning("PATCH /api/hours/{Id}/reject - Hours log not found or access denied for organisation {OrganisationId}", 
                    id, organisationId);
                return NotFound();
            }

            _logger.LogInformation("PATCH /api/hours/{Id}/reject - Successfully rejected hours log for organisation {OrganisationId} by user {UserId}", 
                id, organisationId, userId);
            return Ok(hoursLog);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PATCH /api/hours/{Id}/reject - Error rejecting hours log for organisation {OrganisationId}", 
                id, organisationId);
            return StatusCode(500, "An error occurred while rejecting the hours log");
        }
    }
}
