namespace Voli.Api.Models;

public class Application : BaseDocument
{
    public string OpportunityId { get; set; } = string.Empty;
    public string StudentUserId { get; set; } = string.Empty;
    public string Status { get; set; } = "submitted"; // submitted, withdrawn, accepted, rejected
    public string? Message { get; set; }
}

