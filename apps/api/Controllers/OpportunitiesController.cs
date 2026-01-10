using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Voli.Api.DTOs;
using Voli.Api.Services;

namespace Voli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OpportunitiesController : ControllerBase
{
    private readonly IOpportunitiesService _service;

    public OpportunitiesController(IOpportunitiesService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetPublishedOpportunities()
    {
        var opportunities = await _service.GetPublishedOpportunitiesAsync();
        return Ok(opportunities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetOpportunity(string id)
    {
        var opportunity = await _service.GetOpportunityByIdAsync(id);
        if (opportunity == null)
            return NotFound();

        return Ok(opportunity);
    }

    [HttpPost]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<object>> CreateOpportunity([FromBody] CreateOpportunityDto dto)
    {
        var organisationId = User.FindFirstValue("organisationId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(organisationId))
            return Unauthorized("Organisation ID not found in token");

        var opportunity = await _service.CreateOpportunityAsync(organisationId, dto);
        return CreatedAtAction(nameof(GetOpportunity), new { id = opportunity.Id }, opportunity);
    }

    [HttpPatch("{id}")]
    [Authorize(Policy = "Organisation")]
    public async Task<ActionResult<object>> UpdateOpportunity(string id, [FromBody] UpdateOpportunityDto dto)
    {
        var organisationId = User.FindFirstValue("organisationId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(organisationId))
            return Unauthorized("Organisation ID not found in token");

        var opportunity = await _service.UpdateOpportunityAsync(id, organisationId, dto);
        if (opportunity == null)
            return NotFound();

        return Ok(opportunity);
    }
}

