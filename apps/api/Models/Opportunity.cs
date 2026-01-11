namespace Voli.Api.Models;

public class Opportunity : BaseDocument
{
  public string OrganisationId { get; set; } = string.Empty;
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string Location { get; set; } = string.Empty;
  public List<string> Skills { get; set; } = new();
  public List<string> CauseAreas { get; set; } = new();
  public string TimeCommitment { get; set; } = string.Empty;
  public string Status { get; set; } = "draft"; // draft, published, closed
}

