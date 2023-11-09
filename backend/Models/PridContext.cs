using Microsoft.EntityFrameworkCore;
using System;

namespace prid_2324.Models;

public class PridContext : DbContext
{
    public PridContext(DbContextOptions<PridContext> options)
        : base(options) {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasIndex(m => m.Pseudo).IsUnique();
        modelBuilder.Entity<User>().HasIndex(m => m.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(m => new { m.FirstName, m.LastName }).IsUnique();

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Pseudo = "ben", Password = "ben",Email ="ben@epfc.eu", LastName ="Penelle",FirstName = "Benoît", BirthDate = new DateTimeOffset(new DateTime(1970, 1, 2))},
            new User { Id = 2, Pseudo = "bruno", Password = "bruno",Email ="bruno@epfc.eu", LastName = "Lacroix", FirstName = "Bruno", BirthDate = new DateTimeOffset(new DateTime(1970, 3, 2)) },
            new User { Id = 3, Pseudo = "alain", Password = "alain",Email="alain@epfc.eu", LastName = "Silovy", FirstName = "Alain" },
            new User { Id = 4, Pseudo = "xavier", Password = "xavier",Email="xavier@epfc.eu", LastName = "Pigeolet",FirstName = "Xavier" },
            new User { Id = 5, Pseudo = "boris", Password = "boris",Email="boris@epfc.eu", LastName = "Verhaegen", FirstName = "Boris" },
            new User { Id = 6, Pseudo = "marc", Password = "marc",Email="marc@epfc.eu", LastName = "Michel", FirstName = "Marc" }
        );
    }

    public DbSet<User> Users => Set<User>();
}
