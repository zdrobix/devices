using System.Diagnostics;
using System.Runtime.Intrinsics.Arm;


namespace devices_api.Models.Domain
{
    public class Device : Entity<int>
    {
        public string Name { get; set; }
        public string Manufacturer{ get; set; }
        public string Type{ get; set; }
        public string OperatingSystem{ get; set; }
        public string? OperatingSystemVersion{ get; set; }
        public string? Processor{ get; set; }
        public string? RAM{ get; set; }
        public string? Description{ get; set; }
        public User? UsedBy { get; set; }

        public Device(
            string name, 
            string manufacturer, 
            string type, 
            string operatingSystem, 
            string operatingSystemVersion, 
            string processor, 
            string ram, 
            string description,
            User? usedBy)
        {
            Name = name;
            Manufacturer = manufacturer;
            Type = type;
            OperatingSystem = operatingSystem;
            OperatingSystemVersion = operatingSystemVersion;
            Processor = processor;
            RAM = ram;
            Description = description;
            UsedBy = usedBy!;
        }

        public Device()
        {
            Name = "";
            Manufacturer = "";
            Type = "";
            OperatingSystem = "";
            OperatingSystemVersion = "";
            Processor = "";
            RAM = "";
            Description = "";
            UsedBy = null!;
        }

    }
}
