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

    public SeedController(
        SeedService seedService,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        _seedService = seedService;
        _configuration = configuration;
        _environment = environment;
    }

    [HttpPost]
    public async Task<IActionResult> Seed()
    {
        // Hard block production
        if (_environment.IsProduction())
        {
            return Forbid("Seeding is not allowed in production");
        }

        // Check environment and flag
        var allowSeeding = _configuration.GetValue<bool>("Seeding:AllowSeeding");
        if (!allowSeeding)
        {
            return BadRequest("Seeding is not enabled. Set Seeding:AllowSeeding=true");
        }

        // Check for secret header (optional additional protection)
        var secret = Request.Headers["X-Seed-Secret"].FirstOrDefault();
        var expectedSecret = _configuration["Seeding:Secret"];
        if (!string.IsNullOrEmpty(expectedSecret) && secret != expectedSecret)
        {
            return Unauthorized("Invalid seed secret");
        }

        await _seedService.SeedAsync();

        return Ok(new { message = "Database seeded successfully" });
    }
}

