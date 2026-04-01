using System.Diagnostics;
using System.Runtime.Intrinsics.Arm;

namespace devices_api.Models.DTO
{
    public class DeviceDTO 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Manufacturer{ get; set; }
        public string Type{ get; set; }
        public string OperatingSystem{ get; set; }
        public string? OperatingSystemVersion{ get; set; }
        public string? Processor{ get; set; }
        public string? RAM{ get; set; }
        public string? Description{ get; set; }
        public UserDTO? UsedBy { get; set; }
    }
}
