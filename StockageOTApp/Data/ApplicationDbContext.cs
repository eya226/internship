using Microsoft.EntityFrameworkCore;
using StockageOTApp.Models;
using StockageOTApp.Data;
namespace StockageOTApp.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DB Sets
    public DbSet<Stockage> Stockages { get; set; }
    public DbSet<StockOT> StockOTs { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Optional: Add any model-level configurations here
        // Example:
        // modelBuilder.Entity<Stockage>().ToTable("Stockages");
        // modelBuilder.Entity<StockOT>().ToTable("StockOTs");
        // modelBuilder.Entity<User>().ToTable("Users");
    }
}