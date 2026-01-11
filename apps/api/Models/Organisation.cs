namespace Voli.Api.Models;

public class Organisation : BaseDocument
{
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string? Website { get; set; }
  public string? LogoUrl { get; set; }
}

