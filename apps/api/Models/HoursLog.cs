namespace Voli.Api.Models;

public class HoursLog : BaseDocument
{
  public string OrganisationId { get; set; } = string.Empty;
  public string OpportunityId { get; set; } = string.Empty;
  public string StudentUserId { get; set; } = string.Empty;
  public DateTime Date { get; set; }
  public int Minutes { get; set; }
  public string? Notes { get; set; }
  public string Status { get; set; } = "submitted"; // submitted, approved, rejected
  public string? ReviewedByUserId { get; set; }
}

