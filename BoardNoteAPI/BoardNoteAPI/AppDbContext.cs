using BoardNoteAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BoardNoteAPI
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
                    : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Note>()
                .HasOne(n => n.Board)
                .WithMany(b => b.Notes)
                .HasForeignKey(n => n.BoardId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NoteConnection>()
                .HasOne(c => c.FromNote)
                .WithMany(n => n.FromConnections)
                .HasForeignKey(c => c.FromNoteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NoteConnection>()
                .HasOne(c => c.ToNote)
                .WithMany(n => n.ToConnections)
                .HasForeignKey(c => c.ToNoteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Board>()
                .Property(b => b.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Note>()
                .Property(n => n.Title)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Note>()
                .Property(n => n.Content)
                .HasMaxLength(1000);

            modelBuilder.Entity<Note>()
                .Property(n => n.Color)
                .HasMaxLength(20);
        }
        public DbSet<Board> Boards { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<NoteConnection> Connections { get; set; }
    }
}
