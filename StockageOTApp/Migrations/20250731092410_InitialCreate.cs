using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockageOTApp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Stockages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CodeITM = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CodeOT = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Emplacement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateEnregistrement = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stockages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StockOTs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Annee = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CodeOT = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CodeITM = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Order = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CodeComplet = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Emplacement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Station = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateEnregistrement = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockOTs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stockages");

            migrationBuilder.DropTable(
                name: "StockOTs");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
