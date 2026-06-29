using BoardNoteAPI.DTOs;
using BoardNoteAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoardNoteAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NoteController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotes()
        {
            var notes = await _db.Notes.ToListAsync();
            if (notes == null) return NotFound();
            return Ok(notes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNote(Guid id)
        {
            var note = await _db.Notes.FirstAsync(x => x.Id == id);
            if (note == null) return NotFound();
            return Ok(note);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] CreateNoteDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required");

            var boardExists = await _db.Boards.AnyAsync(x => x.Id == dto.BoardId);

            if (!boardExists)
                return NotFound("Board not found");

            var note = new Note
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Content = dto.Content,
                BoardId = dto.BoardId,
                Color = "red",
                PositionX = 0,
                PositionY = 0
            };

            _db.Notes.Add(note);
            await _db.SaveChangesAsync();

            return Ok(note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(Guid id,  UpdateNoteDto dto)
        {
            var note = _db.Notes.FirstOrDefault(x => x.Id == id);
            if (note == null) return BadRequest();
            if (dto == null) return BadRequest();

            note.Title = dto.Title;
            note.Content = dto.Content;
            note.Color = dto.Color;
            await _db.SaveChangesAsync();
            return Ok(note);

        }

        [HttpPut("{id}/position")]
        public async Task<IActionResult> UpdatePosition(Guid id,UpdateNotePosDto updateNote)
        {
            var note = await _db.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }
            if (updateNote == null)
                return BadRequest();

            note.PositionX = updateNote.PositionX;
            note.PositionY = updateNote.PositionY;
            await _db.SaveChangesAsync();
            return Ok(note);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(Guid id)
        {
            var note = await _db.Notes.FirstOrDefaultAsync(x => x.Id == id);

            if (note == null)
                return NotFound();

            var connections = await _db.Connections
                .Where(x =>
                    x.FromNoteId == id ||
                    x.ToNoteId == id)
                .ToListAsync();

            _db.Connections.RemoveRange(connections);

            _db.Notes.Remove(note);

            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
