using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Voli.Api.DTOs;
using Voli.Api.Services;

namespace Voli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationsService _service;
    private readonly ILogger<ApplicationsController> _logger;

    public ApplicationsController(IApplicationsService service, ILogger<ApplicationsController> logger)
    {
        _service = service;
        _logger = logger;
        _logger.LogDebug("ApplicationsController initialized");
    }

    [HttpPost]
    [Authorize(Policy = "Student")]
    public async Task<ActionResult<object>> CreateApplication([FromBody] CreateApplicationDto dto)
    {
        var studentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("POST /api/applications - Creating application for student {StudentUserId}, opportunity {OpportunityId}", 
            studentUserId, dto.OpportunityId);
        
        if (string.IsNullOrEmpty(studentUserId))
        {
            _logger.LogWarning("POST /api/applications - User ID not found in token");
            return Unauthorized("User ID not found in token");
        }

        try
        {
            _logger.LogDebug("POST /api/applications - Request body: OpportunityId={OpportunityId}, Message={Message}", 
                dto.OpportunityId, dto.Message);
            
            var application = await _service.CreateApplicationAsync(studentUserId, dto);
            
            _logger.LogInformation("POST /api/applications - Successfully created application {ApplicationId} for student {StudentUserId}, opportunity {OpportunityId}", 
                application.Id, studentUserId, dto.OpportunityId);
            
            return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "POST /api/applications - Error creating application for student {StudentUserId}, opportunity {OpportunityId}", 
                studentUserId, dto.OpportunityId);
            return StatusCode(500, "An error occurred while creating the application");
        }
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<object>> GetApplication(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("GET /api/applications/{Id} - Fetching application for user {UserId}", id, userId);
        
        try
        {
            // Implementation would check if user has access
            _logger.LogWarning("GET /api/applications/{Id} - GetApplication not yet implemented", id);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/applications/{Id} - Error fetching application for user {UserId}", id, userId);
            return StatusCode(500, "An error occurred while fetching the application");
        }
    }

    [HttpGet("opportunities/{opportunityId}")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<IEnumerable<object>>> GetApplicationsByOpportunity(string opportunityId)
    {
        var organisationId = User.FindFirstValue("organisationId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("GET /api/applications/opportunities/{OpportunityId} - Fetching applications for organisation {OrganisationId}", 
            opportunityId, organisationId);
        
        try
        {
            var applications = await _service.GetApplicationsByOpportunityIdAsync(opportunityId);
            _logger.LogInformation("GET /api/applications/opportunities/{OpportunityId} - Successfully retrieved {Count} applications for organisation {OrganisationId}", 
                opportunityId, applications.Count(), organisationId);
            return Ok(applications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/applications/opportunities/{OpportunityId} - Error fetching applications for organisation {OrganisationId}", 
                opportunityId, organisationId);
            return StatusCode(500, "An error occurred while fetching applications");
        }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<object>> UpdateApplicationStatus(string id, [FromBody] UpdateApplicationStatusDto dto, [FromQuery] string opportunityId)
    {
        var organisationId = User.FindFirstValue("organisationId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("PATCH /api/applications/{Id}/status - Updating application status to {Status} for organisation {OrganisationId}", 
            id, dto.Status, organisationId);
        
        if (string.IsNullOrEmpty(opportunityId))
        {
            _logger.LogWarning("PATCH /api/applications/{Id}/status - Missing opportunityId query parameter", id);
            return BadRequest("opportunityId query parameter is required");
        }

        try
        {
            _logger.LogDebug("PATCH /api/applications/{Id}/status - Update request: Status={Status}, OpportunityId={OpportunityId}, OrganisationId={OrganisationId}", 
                id, dto.Status, opportunityId, organisationId);
            
            var application = await _service.UpdateApplicationStatusAsync(id, opportunityId, dto);
            
            if (application == null)
            {
                _logger.LogWarning("PATCH /api/applications/{Id}/status - Application not found or access denied for organisation {OrganisationId}", 
                    id, organisationId);
                return NotFound();
            }

            _logger.LogInformation("PATCH /api/applications/{Id}/status - Successfully updated application status to {Status} for organisation {OrganisationId}", 
                id, dto.Status, organisationId);
            return Ok(application);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PATCH /api/applications/{Id}/status - Error updating application status for organisation {OrganisationId}", 
                id, organisationId);
            return StatusCode(500, "An error occurred while updating the application status");
        }
    }
}
