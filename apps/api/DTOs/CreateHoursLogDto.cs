namespace Voli.Api.DTOs;

public class CreateHoursLogDto
{
  public string OrganisationId { get; set; } = string.Empty;
  public string OpportunityId { get; set; } = string.Empty;
  public DateTime Date { get; set; }
  public int Minutes { get; set; }
  public string? Notes { get; set; }
}

