using Voli.Api.Models;
using Voli.Api.Repositories;

namespace Voli.Api.Services;

public class SeedService
{
  private readonly IOrganisationsRepository _organisationsRepository;
  private readonly IOpportunitiesRepository _opportunitiesRepository;
  private readonly IUsersRepository _usersRepository;
  private readonly IApplicationsRepository _applicationsRepository;
  private readonly IHoursLogsRepository _hoursLogsRepository;

  public SeedService(
      IOrganisationsRepository organisationsRepository,
      IOpportunitiesRepository opportunitiesRepository,
      IUsersRepository usersRepository,
      IApplicationsRepository applicationsRepository,
      IHoursLogsRepository hoursLogsRepository)
  {
    _organisationsRepository = organisationsRepository;
    _opportunitiesRepository = opportunitiesRepository;
    _usersRepository = usersRepository;
    _applicationsRepository = applicationsRepository;
    _hoursLogsRepository = hoursLogsRepository;
  }

  public async Task SeedAsync()
  {
    // Create organisations
    var org1 = new Organisation
    {
      Id = "org-1",
      Name = "Green Future Initiative",
      Description = "Environmental conservation and sustainability",
      Website = "https://greenfuture.example.com"
    };

    var org2 = new Organisation
    {
      Id = "org-2",
      Name = "Community Care Network",
      Description = "Supporting local communities through various programs",
      Website = "https://communitycare.example.com"
    };

    await _organisationsRepository.CreateAsync(org1);
    await _organisationsRepository.CreateAsync(org2);

    // Create users
    var student1 = new User
    {
      Id = "student-1",
      Email = "student1@example.com",
      Name = "Alice Student",
      Role = "student"
    };

    var student2 = new User
    {
      Id = "student-2",
      Email = "student2@example.com",
      Name = "Bob Student",
      Role = "student"
    };

    var orgUser1 = new User
    {
      Id = "org-user-1",
      Email = "org@greenfuture.example.com",
      Name = "Org Manager",
      Role = "organisation",
      OrganisationId = "org-1"
    };

    await _usersRepository.CreateAsync(student1);
    await _usersRepository.CreateAsync(student2);
    await _usersRepository.CreateAsync(orgUser1);

    // Create opportunities
    var opportunities = new List<Opportunity>();
    for (int i = 1; i <= 20; i++)
    {
      var orgId = i % 2 == 0 ? "org-1" : "org-2";
      var opportunity = new Opportunity
      {
        Id = $"opp-{i}",
        OrganisationId = orgId,
        Title = $"Opportunity {i}",
        Description = $"Description for opportunity {i}",
        Location = i % 3 == 0 ? "Remote" : "On-site",
        Skills = new List<string> { "Communication", "Teamwork" },
        CauseAreas = new List<string> { "Environment", "Community" },
        TimeCommitment = "5-10 hours/week",
        Status = i <= 15 ? "published" : "draft"
      };
      opportunities.Add(opportunity);
      await _opportunitiesRepository.CreateAsync(opportunity);
    }

    // Create applications
    var app1 = new Application
    {
      Id = "app-1",
      OpportunityId = "opp-1",
      StudentUserId = "student-1",
      Status = "submitted",
      Message = "I'm interested in this opportunity!"
    };

    var app2 = new Application
    {
      Id = "app-2",
      OpportunityId = "opp-1",
      StudentUserId = "student-2",
      Status = "accepted",
      Message = "Looking forward to contributing"
    };

    var app3 = new Application
    {
      Id = "app-3",
      OpportunityId = "opp-2",
      StudentUserId = "student-1",
      Status = "submitted"
    };

    await _applicationsRepository.CreateAsync(app1);
    await _applicationsRepository.CreateAsync(app2);
    await _applicationsRepository.CreateAsync(app3);

    // Create hours logs
    var hoursLog1 = new HoursLog
    {
      Id = "hours-1",
      OrganisationId = "org-1",
      OpportunityId = "opp-1",
      StudentUserId = "student-1",
      Date = DateTime.UtcNow.AddDays(-7),
      Minutes = 240, // 4 hours
      Notes = "Helped with event setup",
      Status = "approved",
      ReviewedByUserId = "org-user-1"
    };

    var hoursLog2 = new HoursLog
    {
      Id = "hours-2",
      OrganisationId = "org-1",
      OpportunityId = "opp-1",
      StudentUserId = "student-1",
      Date = DateTime.UtcNow.AddDays(-3),
      Minutes = 180, // 3 hours
      Notes = "Attended volunteer meeting",
      Status = "submitted"
    };

    await _hoursLogsRepository.CreateAsync(hoursLog1);
    await _hoursLogsRepository.CreateAsync(hoursLog2);
  }
}

