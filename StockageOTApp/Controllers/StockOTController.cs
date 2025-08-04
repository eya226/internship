using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockageOTApp.Data;
using StockageOTApp.Models;
using StockageOTApp.TDO;
using System.Linq;
using System;

namespace StockageOTApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockOTController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StockOTController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateStockOT([FromBody] StockOTDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.CodeComplet) || dto.CodeComplet.Length != 14)
            {
                return BadRequest("CodeComplet invalide (14 caractères attendus)");
            }

            if (_context.StockOTs.Any(x => x.CodeComplet == dto.CodeComplet))
            {
                return Conflict("Ce code plan existe déjà.");
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
                Station = dto.Station,
                DateEnregistrement = DateTime.Now
            };

            _context.StockOTs.Add(stockOT);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetByCodeComplet), new { codeComplet = stockOT.CodeComplet }, stockOT);
        }

        [HttpGet("{codeComplet}")]
        public IActionResult GetByCodeComplet(string codeComplet)
        {
            var stockOT = _context.StockOTs.FirstOrDefault(x => x.CodeComplet == codeComplet);
            if (stockOT == null)
            {
                return NotFound();
            }
            return Ok(stockOT);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.StockOTs.ToList());
        }

        [HttpGet("by-emplacement/{emplacement}")]
        public IActionResult GetByEmplacement(string emplacement)
        {
            var items = _context.StockOTs
                .Where(x => x.Emplacement == emplacement)
                .OrderBy(x => x.DateEnregistrement)
                .ToList();
            
            if (!items.Any())
            {
                return NotFound();
            }
            return Ok(items);
        }

        [HttpPut("{codeComplet}")]
        public IActionResult Update(string codeComplet, [FromBody] StockOTDto dto)
        {
            if (codeComplet != dto.CodeComplet)
            {
                return BadRequest("CodeComplet mismatch");
            }

            var existing = _context.StockOTs.FirstOrDefault(x => x.CodeComplet == codeComplet);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Emplacement = dto.Emplacement;
            existing.Station = dto.Station;
            existing.DateEnregistrement = DateTime.Now;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{codeComplet}")]
        public IActionResult Delete(string codeComplet)
        {
            var stockOT = _context.StockOTs.FirstOrDefault(x => x.CodeComplet == codeComplet);
            if (stockOT == null)
            {
                return NotFound();
            }

            _context.StockOTs.Remove(stockOT);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpGet("check-duplicate")]
        public IActionResult CheckDuplicate([FromQuery] string codeComplet)
        {
            if (string.IsNullOrEmpty(codeComplet))
            {
                return BadRequest("CodeComplet is required");
            }

            var exists = _context.StockOTs.Any(x => x.CodeComplet == codeComplet);
            return Ok(new { exists });
        }

        [HttpGet("station-counts")]
        public IActionResult GetStationCounts()
        {
            var counts = _context.StockOTs
                .GroupBy(x => x.Station)
                .Select(g => new { Station = g.Key, Count = g.Count() })
                .ToList();
            
            return Ok(counts);
        }

        [HttpGet("stuck-items")]
        public IActionResult GetStuckItems([FromQuery] int min = 15)
        {
            var stuckTime = DateTime.Now.AddMinutes(-min);
            var stuckItems = _context.StockOTs
                .Where(x => x.Station != "DELIVERED" && x.DateEnregistrement < stuckTime)
                .ToList();

            return Ok(stuckItems);
        }
    }
}