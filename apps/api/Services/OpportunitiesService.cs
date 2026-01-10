using Voli.Api.DTOs;
using Voli.Api.Models;
using Voli.Api.Repositories;

namespace Voli.Api.Services;

public class OpportunitiesService : IOpportunitiesService
{
    private readonly IOpportunitiesRepository _repository;

    public OpportunitiesService(IOpportunitiesRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Opportunity>> GetPublishedOpportunitiesAsync()
    {
        return await _repository.GetAllPublishedAsync();
    }

    public async Task<Opportunity?> GetOpportunityByIdAsync(string id)
    {
        // For getting by ID, we need the organisationId as partition key
        // This is a limitation - we'd need to query across partitions or maintain a secondary index
        // For now, we'll use a workaround: query all published and filter
        var opportunities = await _repository.GetAllPublishedAsync();
        return opportunities.FirstOrDefault(o => o.Id == id);
    }

    public async Task<Opportunity> CreateOpportunityAsync(string organisationId, CreateOpportunityDto dto)
    {
        var opportunity = new Opportunity
        {
            OrganisationId = organisationId,
            Title = dto.Title,
            Description = dto.Description,
            Location = dto.Location,
            Skills = dto.Skills,
            CauseAreas = dto.CauseAreas,
            TimeCommitment = dto.TimeCommitment,
            Status = "draft"
        };

        return await _repository.CreateAsync(opportunity);
    }

    public async Task<Opportunity?> UpdateOpportunityAsync(string id, string organisationId, UpdateOpportunityDto dto)
    {
        var opportunity = await _repository.GetByIdAsync(id, organisationId);
        if (opportunity == null)
            return null;

        if (dto.Title != null) opportunity.Title = dto.Title;
        if (dto.Description != null) opportunity.Description = dto.Description;
        if (dto.Location != null) opportunity.Location = dto.Location;
        if (dto.Skills != null) opportunity.Skills = dto.Skills;
        if (dto.CauseAreas != null) opportunity.CauseAreas = dto.CauseAreas;
        if (dto.TimeCommitment != null) opportunity.TimeCommitment = dto.TimeCommitment;
        if (dto.Status != null) opportunity.Status = dto.Status;

        return await _repository.UpdateAsync(opportunity);
    }
}

