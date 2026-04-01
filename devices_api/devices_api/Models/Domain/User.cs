namespace devices_api.Models.Domain
{
    public class User : Entity<int>
    {
        public string Name { get; set; }
        public string Role { get; set; }
        public string Location { get; set; }
        public string Password { get; set; }


        public User(
            string name, 
            string role, 
            string location, 
            string password)
        {
            Name = name;
            Role = role;
            Location = location;
            Password = password;
        }

        public User()
        {
            Name = "";
            Role = "";
            Location = "";
            Password = "";
        }
    }
}
