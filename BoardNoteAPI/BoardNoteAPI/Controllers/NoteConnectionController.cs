using BoardNoteAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BoardNoteAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteConnectionController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NoteConnectionController(AppDbContext db)
        {
            _db = db;
        }


        [HttpGet("{boardId}")]
        public async Task<IActionResult> GetConnections(Guid boardId)
        {
            var connections = await _db.Connections
                .Where(x => x.BoardId == boardId)
                .ToListAsync();

            return Ok(connections);
        }

        [HttpPost]
        public async Task<IActionResult> PostConnection(Guid noteFrom, Guid noteTo)
        {
            if (!_db.Notes.Any(x => x.Id == noteFrom) || !_db.Notes.Any(x => x.Id == noteTo))
            {
                return BadRequest();
            }
            if (noteFrom == noteTo) return NoContent();

            var fromNote = await _db.Notes.FindAsync(noteFrom);

            if (fromNote == null) return BadRequest();

            var connection = new NoteConnection
            {
                Id = Guid.NewGuid(),
                FromNoteId = noteFrom,
                ToNoteId = noteTo,
                BoardId = fromNote.BoardId
            };
            _db.Connections.Add(connection);
            await _db.SaveChangesAsync();
            return Ok(connection);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConnection(Guid id)
        {
            var con = await _db.Connections.FirstOrDefaultAsync(x => x.Id == id);
            if (con == null) return BadRequest();
            _db.Connections.Remove(con);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
