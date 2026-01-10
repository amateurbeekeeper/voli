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

    public ApplicationsController(IApplicationsService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize(Policy = "Student")]
    public async Task<ActionResult<object>> CreateApplication([FromBody] CreateApplicationDto dto)
    {
        var studentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(studentUserId))
            return Unauthorized("User ID not found in token");

        var application = await _service.CreateApplicationAsync(studentUserId, dto);
        return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<object>> GetApplication(string id)
    {
        // Implementation would check if user has access
        return Ok();
    }

    [HttpGet("opportunities/{opportunityId}")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<IEnumerable<object>>> GetApplicationsByOpportunity(string opportunityId)
    {
        var applications = await _service.GetApplicationsByOpportunityIdAsync(opportunityId);
        return Ok(applications);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<object>> UpdateApplicationStatus(string id, [FromBody] UpdateApplicationStatusDto dto)
    {
        // Need opportunityId from query or body to get partition key
        var opportunityId = Request.Query["opportunityId"].ToString();
        if (string.IsNullOrEmpty(opportunityId))
            return BadRequest("opportunityId query parameter is required");

        var application = await _service.UpdateApplicationStatusAsync(id, opportunityId, dto);
        if (application == null)
            return NotFound();

        return Ok(application);
    }
}

