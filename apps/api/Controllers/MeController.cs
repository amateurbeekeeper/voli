using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Voli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeController : ControllerBase
{
    private readonly ILogger<MeController> _logger;

    public MeController(ILogger<MeController> logger)
    {
        _logger = logger;
        _logger.LogDebug("MeController initialized");
    }

    [HttpGet]
    public IActionResult GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var role = User.FindFirstValue("role");
        var name = User.FindFirstValue(ClaimTypes.Name);
        
        _logger.LogInformation("GET /api/me - Fetching user profile for user {UserId}, role {Role}", userId, role);
        _logger.LogDebug("GET /api/me - User claims: Email={Email}, Name={Name}, Role={Role}", email, name, role);

        var userProfile = new
        {
            id = userId,
            email = email,
            name = name,
            role = role
        };

        _logger.LogInformation("GET /api/me - Successfully retrieved user profile for user {UserId}", userId);
        return Ok(userProfile);
    }
}
