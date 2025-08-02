namespace StockageOTApp.Models
{
    public class Stockage
    {
        public int Id { get; set; }

        public string CodeITM { get; set; }
        public string CodeOT { get; set; }
        public string Emplacement { get; set; }
        public DateTime DateEnregistrement { get; set; } = DateTime.Now;
    }
}
