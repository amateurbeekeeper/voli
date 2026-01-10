using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Voli.Api.Data;
using Voli.Api.Repositories;
using Voli.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Voli API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Cosmos DB configuration
var cosmosEndpoint = builder.Configuration["CosmosDb:Endpoint"];
var cosmosKey = builder.Configuration["CosmosDb:Key"];
var cosmosDatabaseName = builder.Configuration["CosmosDb:DatabaseName"];

if (!string.IsNullOrEmpty(cosmosEndpoint) && !string.IsNullOrEmpty(cosmosKey))
{
    builder.Services.AddSingleton<CosmosClientWrapper>(sp =>
        new CosmosClientWrapper(cosmosEndpoint, cosmosKey, cosmosDatabaseName));

    // Register repositories
    builder.Services.AddScoped<IOpportunitiesRepository, OpportunitiesRepository>();
    builder.Services.AddScoped<IApplicationsRepository, ApplicationsRepository>();
    builder.Services.AddScoped<IHoursLogsRepository, HoursLogsRepository>();
    builder.Services.AddScoped<IOrganisationsRepository, OrganisationsRepository>();
    builder.Services.AddScoped<IUsersRepository, UsersRepository>();

    // Register services
    builder.Services.AddScoped<IOpportunitiesService, OpportunitiesService>();
    builder.Services.AddScoped<IApplicationsService, ApplicationsService>();
    builder.Services.AddScoped<IHoursLogsService, HoursLogsService>();
    builder.Services.AddScoped<SeedService>();
}

// JWT Authentication (placeholder - configure based on auth provider)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Configure based on auth provider (Auth0, Clerk, Entra ID B2C)
    // This is a placeholder - update with actual issuer and audience
    var authority = builder.Configuration["Auth:Authority"];
    var audience = builder.Configuration["Auth:Audience"];

    if (!string.IsNullOrEmpty(authority))
    {
        options.Authority = authority;
        options.Audience = audience;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };
    }
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Student", policy => policy.RequireClaim("role", "student", "admin"));
    options.AddPolicy("Organisation", policy => policy.RequireClaim("role", "organisation", "admin"));
    options.AddPolicy("Admin", policy => policy.RequireClaim("role", "admin"));
});

// Health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

