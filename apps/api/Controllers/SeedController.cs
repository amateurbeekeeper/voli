using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Voli.Api.Services;

namespace Voli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
  private readonly SeedService _seedService;
  private readonly IConfiguration _configuration;
  private readonly IWebHostEnvironment _environment;
  private readonly ILogger<SeedController> _logger;

  public SeedController(
      SeedService seedService,
      IConfiguration configuration,
      IWebHostEnvironment environment,
      ILogger<SeedController> logger)
  {
    _seedService = seedService;
    _configuration = configuration;
    _environment = environment;
    _logger = logger;
    _logger.LogDebug("SeedController initialized");
  }

  [HttpPost]
  public async Task<IActionResult> Seed()
  {
    _logger.LogInformation("POST /api/seed - Seed request received, environment: {Environment}", _environment.EnvironmentName);

    // Hard block production
    if (_environment.IsProduction())
    {
      _logger.LogWarning("POST /api/seed - Seed attempt blocked in production environment");
      return Forbid("Seeding is not allowed in production");
    }

    // Check environment and flag
    var allowSeeding = _configuration.GetValue<bool>("Seeding:AllowSeeding");
    if (!allowSeeding)
    {
      _logger.LogWarning("POST /api/seed - Seed request rejected: AllowSeeding is false");
      return BadRequest("Seeding is not enabled. Set Seeding:AllowSeeding=true");
    }

    // Check for secret header (optional additional protection)
    var secret = Request.Headers["X-Seed-Secret"].FirstOrDefault();
    var expectedSecret = _configuration["Seeding:Secret"];
    if (!string.IsNullOrEmpty(expectedSecret) && secret != expectedSecret)
    {
      _logger.LogWarning("POST /api/seed - Seed request rejected: Invalid seed secret");
      return Unauthorized("Invalid seed secret");
    }

    try
    {
      _logger.LogInformation("POST /api/seed - Starting database seed operation");
      await _seedService.SeedAsync();
      _logger.LogInformation("POST /api/seed - Database seed operation completed successfully");

      return Ok(new { message = "Database seeded successfully" });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "POST /api/seed - Error during database seed operation");
      return StatusCode(500, new { message = "An error occurred while seeding the database", error = ex.Message });
    }
  }
}
