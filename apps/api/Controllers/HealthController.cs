using Microsoft.AspNetCore.Mvc;

namespace Voli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        _logger.LogDebug("GET /api/health - Health check requested");
        
        var response = new { status = "healthy", timestamp = DateTime.UtcNow };
        _logger.LogInformation("GET /api/health - Health check passed at {Timestamp}", response.timestamp);
        
        return Ok(response);
    }
}
