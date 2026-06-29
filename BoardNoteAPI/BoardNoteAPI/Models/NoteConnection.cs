namespace BoardNoteAPI.Models
{
    public class NoteConnection
    {
        public Guid Id { get; set; }
        public Guid FromNoteId { get; set; }
        public Guid ToNoteId { get; set; }
        public Note FromNote { get; set; }
        public Note ToNote { get; set; }

        public Guid BoardId { get; set; }
    }
}
