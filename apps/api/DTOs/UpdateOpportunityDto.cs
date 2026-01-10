namespace Voli.Api.DTOs;

public class UpdateOpportunityDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public List<string>? Skills { get; set; }
    public List<string>? CauseAreas { get; set; }
    public string? TimeCommitment { get; set; }
    public string? Status { get; set; }
}

