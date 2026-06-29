using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace BoardNoteAPI.Models
{
    public class Note
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Color { get; set; }
        public double PositionX { get; set; }
        public double PositionY { get; set; }
        public double Rotation { get; set; }

        public Guid BoardId { get; set; }

        [JsonIgnore]
        public Board Board { get; set; }

        [JsonIgnore]
        public ICollection<NoteConnection> FromConnections { get; set; } = new List<NoteConnection>();
        [JsonIgnore]
        public ICollection<NoteConnection> ToConnections { get; set; } = new List<NoteConnection>();
    }
}
