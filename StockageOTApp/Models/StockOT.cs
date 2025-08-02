
namespace StockageOTApp.Models
{
    public class StockOT
    {
        public int Id { get; set; }
        public string Annee { get; set; }
        public string CodeOT { get; set; }
        public string Type { get; set; }
        public string CodeITM { get; set; }
        public string Order { get; set; }
        public string CodeComplet { get; set; }
        public string Emplacement { get; set; }
        public string Station { get; set; }
        public DateTime DateEnregistrement { get; set; } = DateTime.Now;
    }
}
