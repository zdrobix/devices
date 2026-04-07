using devices_api.Models.DTO;
using devices_api.Models.Domain;
using devices_api.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace devices_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceRepository deviceRepository;

        public DeviceController(IDeviceRepository deviceRepository)
        {
            this.deviceRepository = deviceRepository;
            Log.Information("DeviceController initialized");
        }

        // GET: api/device
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllDevices()
        {
            Log.Information("Fetching all devices");
            var devices = await deviceRepository.GetAllAsync();

            var deviceDtos = devices.Select(device => new DeviceDTO
            {
                Id = device.Id,
                Name = device.Name,
                Manufacturer = device.Manufacturer,
                Type = device.Type,
                OperatingSystem = device.OperatingSystem,
                OperatingSystemVersion = device.OperatingSystemVersion,
                Processor = device.Processor,
                RAM = device.RAM,
                Description = device.Description,
                UsedBy = device.UsedBy != null ? new UserDTO
                {
                    Id = device.UsedBy.Id,
                    Name = device.UsedBy.Name,
                    Role = device.UsedBy.Role
                } : null
            });

            return Ok(deviceDtos);
        }

        // GET: api/device/{id}
        [Authorize]
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetDeviceById(int id)
        {
            Log.Information($"Searching for device with id {id}");
            var device = await deviceRepository.GetById(id);

            if (device == null)
            {
                Log.Information($"Device with id {id} not found");
                return NotFound();
            }

            return Ok(MapToDTO(device));
        }

        // POST: api/device
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateDevice([FromBody] DeviceDTO deviceDto)
        {
            var device = new Device(
                deviceDto.Name,
                deviceDto.Manufacturer,
                deviceDto.Type,
                deviceDto.OperatingSystem,
                deviceDto.OperatingSystemVersion ?? "",
                deviceDto.Processor ?? "",
                deviceDto.RAM ?? "",
                deviceDto.Description ?? "",
                null
            );

            device = await deviceRepository.CreateAsync(device);
            Log.Information($"Created new device with id {device.Id}");

            return CreatedAtAction(nameof(GetDeviceById), new { id = device.Id }, MapToDTO(device));
        }

        // PUT: api/device/{id}
        [Authorize]
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateDevice([FromRoute] int id, [FromBody] DeviceDTO deviceDto)
        {
            Log.Information($"Updating device with id {id}");
            var device = await deviceRepository.GetById(id);

            if (device == null) return NotFound();

            device.Name = deviceDto.Name;
            device.Manufacturer = deviceDto.Manufacturer;
            device.Type = deviceDto.Type;
            device.OperatingSystem = deviceDto.OperatingSystem;
            device.OperatingSystemVersion = deviceDto.OperatingSystemVersion;
            device.Processor = deviceDto.Processor;
            device.RAM = deviceDto.RAM;
            device.Description = deviceDto.Description;

            device = await deviceRepository.UpdateAsync(device);

            return Ok(MapToDTO(device));
        }

        // DELETE: api/device/{id}
        [Authorize]
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteDevice([FromRoute] int id)
        {
            Log.Information($"Deleting device with id {id}");
            var device = await deviceRepository.DeleteAsync(id);

            if (device == null) return NotFound();

            return Ok(MapToDTO(device));
        }

        // GET: api/device/ping
        [HttpGet]
        [Route("ping")]
        public IActionResult Ping() => Ok("pong");

        // Helper method to keep the code DRY
        private static DeviceDTO MapToDTO(Device device)
        {
            return new DeviceDTO
            {
                Id = device.Id,
                Name = device.Name,
                Manufacturer = device.Manufacturer,
                Type = device.Type,
                OperatingSystem = device.OperatingSystem,
                OperatingSystemVersion = device.OperatingSystemVersion,
                Processor = device.Processor,
                RAM = device.RAM,
                Description = device.Description,
                UsedBy = device.UsedBy == null ? null : new UserDTO
                {
                    Id = device.UsedBy.Id,
                    Name = device.UsedBy.Name,
                    Role = device.UsedBy.Role
                }
            };
        }
    }
}