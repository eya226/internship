using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using StockageOTApp.Models;
using StockageOTApp.Dto;
using BCrypt.Net;
using StockageOTApp.Data;
using Microsoft.EntityFrameworkCore;

namespace StockageOTApp.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // POST /auth/login - Authenticate user and return JWT token
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            return Unauthorized(new { Message = "Nom d'utilisateur ou mot de passe incorrect." });

        var token = GenerateJwtToken(user);
        return Ok(new AuthResponse
        {
            Token = token,
            Username = user.Username,
            Role = user.Role
        });
    }

    // POST /auth/signup - Register new user (default role: User)
    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (existingUser != null)
            return Conflict(new { Message = "Nom d'utilisateur existe déjà." });

        var newUser = new User
        {
            Username = request.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role?.Trim() switch
            {
                "Admin" => "Admin",
                _ => "User"
            }
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Utilisateur enregistré avec succès." });
    }

    // Generates a JWT token for authenticated users
    private string GenerateJwtToken(User user)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Key"]!);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}