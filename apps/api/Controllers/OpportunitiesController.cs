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
  private readonly ILogger<OpportunitiesController> _logger;

  public OpportunitiesController(IOpportunitiesService service, ILogger<OpportunitiesController> logger)
  {
    _service = service;
    _logger = logger;
    _logger.LogDebug("OpportunitiesController initialized");
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<object>>> GetPublishedOpportunities()
  {
    _logger.LogInformation("GET /api/opportunities - Fetching published opportunities");

    try
    {
      var opportunities = await _service.GetPublishedOpportunitiesAsync();
      _logger.LogInformation("GET /api/opportunities - Successfully retrieved {Count} opportunities", opportunities.Count());
      return Ok(opportunities);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "GET /api/opportunities - Error fetching published opportunities");
      return StatusCode(500, "An error occurred while fetching opportunities");
    }
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<object>> GetOpportunity(string id)
  {
    _logger.LogInformation("GET /api/opportunities/{Id} - Fetching opportunity", id);

    try
    {
      var opportunity = await _service.GetOpportunityByIdAsync(id);
      if (opportunity == null)
      {
        _logger.LogWarning("GET /api/opportunities/{Id} - Opportunity not found", id);
        return NotFound();
      }

      _logger.LogInformation("GET /api/opportunities/{Id} - Successfully retrieved opportunity", id);
      return Ok(opportunity);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "GET /api/opportunities/{Id} - Error fetching opportunity", id);
      return StatusCode(500, "An error occurred while fetching the opportunity");
    }
  }

  [HttpPost]
  [Authorize(Policy = "Organisation")]
  public async Task<ActionResult<object>> CreateOpportunity([FromBody] CreateOpportunityDto dto)
  {
    var organisationId = User.FindFirstValue("organisationId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
    _logger.LogInformation("POST /api/opportunities - Creating opportunity for organisation {OrganisationId}", organisationId);

    if (string.IsNullOrEmpty(organisationId))
    {
      _logger.LogWarning("POST /api/opportunities - Organisation ID not found in token");
      return Unauthorized("Organisation ID not found in token");
    }

    try
    {
      _logger.LogDebug("POST /api/opportunities - Request body: Title={Title}, Location={Location}, TimeCommitment={TimeCommitment}",
          dto.Title, dto.Location, dto.TimeCommitment);

      var opportunity = await _service.CreateOpportunityAsync(organisationId, dto);

      _logger.LogInformation("POST /api/opportunities - Successfully created opportunity {OpportunityId} for organisation {OrganisationId}",
          opportunity.Id, organisationId);

      return CreatedAtAction(nameof(GetOpportunity), new { id = opportunity.Id }, opportunity);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "POST /api/opportunities - Error creating opportunity for organisation {OrganisationId}", organisationId);
      return StatusCode(500, "An error occurred while creating the opportunity");
    }
  }

  [HttpPatch("{id}")]
  [Authorize(Policy = "Organisation")]
  public async Task<ActionResult<object>> UpdateOpportunity(string id, [FromBody] UpdateOpportunityDto dto)
  {
    var organisationId = User.FindFirstValue("organisationId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
    _logger.LogInformation("PATCH /api/opportunities/{Id} - Updating opportunity for organisation {OrganisationId}", id, organisationId);

    if (string.IsNullOrEmpty(organisationId))
    {
      _logger.LogWarning("PATCH /api/opportunities/{Id} - Organisation ID not found in token", id);
      return Unauthorized("Organisation ID not found in token");
    }

    try
    {
      _logger.LogDebug("PATCH /api/opportunities/{Id} - Update request for organisation {OrganisationId}", id, organisationId);

      var opportunity = await _service.UpdateOpportunityAsync(id, organisationId, dto);

      if (opportunity == null)
      {
        _logger.LogWarning("PATCH /api/opportunities/{Id} - Opportunity not found or access denied for organisation {OrganisationId}", id, organisationId);
        return NotFound();
      }

      _logger.LogInformation("PATCH /api/opportunities/{Id} - Successfully updated opportunity for organisation {OrganisationId}", id, organisationId);
      return Ok(opportunity);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "PATCH /api/opportunities/{Id} - Error updating opportunity for organisation {OrganisationId}", id, organisationId);
      return StatusCode(500, "An error occurred while updating the opportunity");
    }
  }
}
