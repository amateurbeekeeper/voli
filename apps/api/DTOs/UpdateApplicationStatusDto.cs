namespace Voli.Api.DTOs;

public class UpdateApplicationStatusDto
{
  public string Status { get; set; } = string.Empty; // submitted, withdrawn, accepted, rejected
}

