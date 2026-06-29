using BoardNoteAPI.DTOs;
using BoardNoteAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace BoardNoteAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoardController : ControllerBase
    {
        private readonly AppDbContext _db;

        public BoardController(AppDbContext db)
        {
            _db = db;
        }




        [HttpGet("{boardId}/notes")]
        public async Task<IActionResult> GetBoardNotes(Guid boardId)
        {
            var boardExists = await _db.Boards.AnyAsync(x => x.Id == boardId);

            if (!boardExists) return NotFound("Board not found");

            var notes = await _db.Notes.Where(n => n.BoardId == boardId).ToListAsync();

            return  Ok(notes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBoard(Guid id)
        {
            var board = await _db.Boards.FirstOrDefaultAsync(x => x.Id == id);
            if (board == null) return NotFound();
            return Ok(board);
        }


        [HttpGet("{id}/connections")]
        public async Task<IActionResult> GetConnection(Guid id)
        {
            var connections = await _db.Connections.Where(x => x.BoardId == id).ToListAsync();
            return Ok(connections);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoard([FromBody] CreateBoardDto dto)
        {
            if (dto == null) return BadRequest();
            if (string.IsNullOrEmpty(dto.Name))return BadRequest();

            var board = new Board
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow
            };

            _db.Boards.Add(board);
            await _db.SaveChangesAsync();
            return Ok(board);
        }
    }
}
