/*using Serilog;
using TravelEase.API.Middlewares;
using TravelEase.API.Common.Extensions;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
    DotNetEnv.Env.Load();

builder.Host.UseSerilog((context, services, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration)
                 .ReadFrom.Services(services)
                 .Enrich.FromLogContext());

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddAuthenticationServices(builder.Configuration);
builder.Services.AddAuthorizationPolicies();
builder.Services.AddSwaggerDocumentation();



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.WithOrigins("http://localhost:3000") 
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

var app = builder.Build();

await app.ApplyMigrationsAndSeedAsync();

app.UseSwaggerIfNeeded();
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseCustomUnauthorizedHandler();
app.UseAuthorization();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<StripeWebhookVerificationMiddleware>();

app.MapControllers();
app.Run();*/

using Serilog;
using TravelEase.API.Middlewares;
using TravelEase.API.Common.Extensions;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
    DotNetEnv.Env.Load();

builder.Host.UseSerilog((context, services, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration)
                 .ReadFrom.Services(services)
                 .Enrich.FromLogContext());

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddAuthenticationServices(builder.Configuration);
builder.Services.AddAuthorizationPolicies();
builder.Services.AddSwaggerDocumentation();


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

await app.ApplyMigrationsAndSeedAsync();

app.UseSwaggerIfNeeded();


// مهم جداً: CORS قبل Authentication
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseCustomUnauthorizedHandler();

app.UseAuthorization();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseMiddleware<StripeWebhookVerificationMiddleware>();

app.MapControllers();

app.Run();