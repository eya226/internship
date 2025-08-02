using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockageOTApp.Data;
using StockageOTApp.Models;
using StockageOTApp.TDO;

namespace StockageOTApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StockageController(ApplicationDbContext context)
        {
            _context = context;
        }

  
        [HttpPost("stockage")]
        public async Task<IActionResult> Create([FromBody] Stockage stockage)
        {
            if (stockage == null)
                return BadRequest("Données invalides.");

            _context.Stockages.Add(stockage);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetStockages), new { id = stockage.Id }, stockage);
        }

        [HttpGet("by-codeitm/{codeITM}")]
        public async Task<IActionResult> GetByCodeITM(string codeITM)
        {
            var result = await _context.Stockages
                .Where(s => s.CodeITM == codeITM)
                .FirstOrDefaultAsync();

            if (result == null)
                return NotFound("Code ITM introuvable.");

            return Ok(result);
        }

        [HttpGet("by-codeot/{codeOT}")]
        public async Task<IActionResult> GetByCodeOT(string codeOT)
        {
            var result = await _context.Stockages
                .Where(s => s.CodeOT == codeOT)
                .FirstOrDefaultAsync();

            if (result == null)
                return NotFound("Code OT introuvable.");

            return Ok(result);
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<Stockage>>> GetStockages()
        {
            var stockages = await _context.Stockages.ToListAsync();

            // Ajouter un log pour vérifier les données retournées
            Console.WriteLine($"Nombre de stockages récupérés: {stockages.Count}");

            return stockages;
        }



        // Pour Stockage (ancienne version)


        // Pour StockOT (code décomposé)
        [HttpPost("stockot")]
        public IActionResult PostStockOT([FromBody] StockOTDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.CodeComplet) || dto.CodeComplet.Length != 14)
            {
                return BadRequest("CodeComplet invalide (14 caractères attendus)");
            }

            var stockOT = new StockOT
            {
                Annee = dto.CodeComplet.Substring(0, 2),
                CodeOT = dto.CodeComplet.Substring(2, 5),
                Type = dto.CodeComplet.Substring(7, 1),
                CodeITM = dto.CodeComplet.Substring(8, 3),
                Order = dto.CodeComplet.Substring(11, 3),
                CodeComplet = dto.CodeComplet,
                Emplacement = dto.Emplacement,
                DateEnregistrement = DateTime.Now
            };

            _context.StockOTs.Add(stockOT);
            _context.SaveChanges();

            return Ok(stockOT);
        }


    }

}
