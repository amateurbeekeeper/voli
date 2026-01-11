namespace Voli.Api.Models;

public class User : BaseDocument
{
  public string Email { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string Role { get; set; } = string.Empty; // student, organisation, admin
  public string? OrganisationId { get; set; }
}

