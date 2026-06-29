using System.Runtime.CompilerServices;

namespace BoardNoteAPI.Models
{
    public class Board
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
