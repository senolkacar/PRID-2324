using Microsoft.EntityFrameworkCore;
using System;

namespace prid_2324.Models;

public class PridContext : DbContext
{
    public DbSet<User> Users {get; set;}
    public DbSet<Student> Students {get; set;}
    public DbSet<Teacher> Teachers {get; set;}
    public PridContext(DbContextOptions<PridContext> options)
        : base(options) {
    }
    // protected override void OnModelCreating(ModelBuilder modelBuilder) {
    //     base.OnModelCreating(modelBuilder);

    //     modelBuilder.Entity<User>().HasIndex(m => m.Pseudo).IsUnique();
    //     modelBuilder.Entity<User>().HasIndex(m => m.Email).IsUnique();
    //     modelBuilder.Entity<User>().HasIndex(m => new { m.FirstName, m.LastName }).IsUnique();

    //     modelBuilder.Entity<User>().HasData(
    //         new User { Id = 1, Pseudo = "ben", Password = "ben",Email ="ben@epfc.eu", LastName ="Penelle",FirstName = "Benoît", BirthDate = new DateTimeOffset(new DateTime(1970, 1, 2))},
    //         new User { Id = 2, Pseudo = "bruno", Password = "bruno",Email ="bruno@epfc.eu", LastName = "Lacroix", FirstName = "Bruno", BirthDate = new DateTimeOffset(new DateTime(1970, 3, 2)) },
    //         new User { Id = 3, Pseudo = "alain", Password = "alain",Email="alain@epfc.eu", LastName = "Silovy", FirstName = "Alain" },
    //         new User { Id = 4, Pseudo = "xavier", Password = "xavier",Email="xavier@epfc.eu", LastName = "Pigeolet",FirstName = "Xavier" },
    //         new User { Id = 5, Pseudo = "boris", Password = "boris",Email="boris@epfc.eu", LastName = "Verhaegen", FirstName = "Boris" },
    //         new User { Id = 6, Pseudo = "marc", Password = "marc",Email="marc@epfc.eu", LastName = "Michel", FirstName = "Marc" }
    //     );
    // }

    protected override void OnModelCreating(ModelBuilder modelBuilder){
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
        .HasDiscriminator(u => u.Role)
        .HasValue<Student>(Role.Student)
        .HasValue<Teacher>(Role.Teacher);

    SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder){
    modelBuilder.Entity<Student>()
     .HasData(
        new Student{Id = 1, Pseudo = "bob", Password = "bob", Email = "bob@epfc.eu", LastName = "Sponge", FirstName = "Bob", BirthDate = new DateTimeOffset(new DateTime(1991, 5, 2))},
        new Student{Id = 2, Pseudo = "john", Password = "john", Email = "john@epfc.eu", LastName = "Deuf", FirstName = "John", BirthDate = new DateTimeOffset(new DateTime(1997, 4, 6))},
        new Student{Id = 3, Pseudo = "ducobu", Password ="ducobu", Email = "ducobu@epfc.eu", LastName = "Ducobu", FirstName = "Léon", BirthDate = new DateTimeOffset(new DateTime(1999, 1, 1))}
     );

    modelBuilder.Entity<Teacher>()
     .HasData(
        new Teacher{Id = 4, Pseudo = "ben", Password = "ben", Email = "ben@epfc.eu", LastName = "Penelle", FirstName = "Benoît", BirthDate = new DateTimeOffset(new DateTime(1983, 7, 8))},
        new Teacher{Id = 5, Pseudo = "boris", Password = "boris", Email = "boris@epfc.eu", LastName = "Verhaegen", FirstName = "Boris", BirthDate = new DateTimeOffset(new DateTime(1980, 3, 2))}
     );
    }

}
