namespace devices_api.Models.DTO
{
    public class AddDeviceRequest
    {
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string Type { get; set; }
        public string OperatingSystem { get; set; }
        public string? OperatingSystemVersion { get; set; }
        public string? Processor { get; set; }
        public string? RAM { get; set; }
        public string? Description { get; set; }
    }
}
