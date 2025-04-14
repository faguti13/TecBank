using TecBankAPI.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<CuentaService>();

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<RolService>();
builder.Services.AddScoped<PrestamoService>();
builder.Services.AddScoped<ClienteService>();
builder.Services.AddScoped<IClienteService,ClienteService>();
builder.Services.AddScoped<AsesorService>();
builder.Services.AddScoped<TarjetaService>();
builder.Services.AddScoped<CuentaService>();
builder.Services.AddScoped<TransaccionService>();
builder.Services.AddScoped<MonedaService>();
builder.Services.AddHostedService<ReporteBackgroundService>();

// Configure CORS with a completely open policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TecBank API v1");
});

// Use CORS - Important: This must be called before UseAuthorization and MapControllers
app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
