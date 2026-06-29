namespace BoardNoteAPI.DTOs
{
    public class CreateNoteDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid BoardId { get; set; }
    }
}
