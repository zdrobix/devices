using devices_api.Models.Domain;
using devices_api.Models.DTO;
using devices_api.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace devices_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceRepository deviceRepository;
        private readonly IUserRepository userRepository;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public DeviceController(
            IDeviceRepository deviceRepository, 
            IUserRepository userRepository,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            this.deviceRepository = deviceRepository;
            this.userRepository = userRepository;
            this._httpClientFactory = httpClientFactory;
            this._config = configuration;
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
                    Role = device.UsedBy.Role,
                    Location = device.UsedBy.Location,
                    Password = "*****"
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
        public async Task<IActionResult> CreateDevice([FromBody] AddDeviceRequest deviceDto)
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
        public async Task<IActionResult> UpdateDevice([FromRoute] int id, [FromBody] UpdateDeviceRequest deviceDto)
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

            if (deviceDto.UsedBy != null)
            {
                var user = await this.userRepository.GetById(deviceDto.UsedBy.Id);
                if ( user == null )
                {
                    return BadRequest("Invalid user for device.");
                }
                device.UsedBy = user;
            }

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

        //GET: api/device/{id}/describe
        [Authorize]
        [HttpGet("describe/{id:int}")]
        public async Task<IActionResult> DescribeDevice([FromRoute] int id)
        {
            var device = await this.deviceRepository.GetById(id);
            if (device == null) return NotFound();
            string prompt = $"Give me a technical description for the device: {device.ToString()} . I expect nothing else but the description of the device, under 300 words.2";

            var client = _httpClientFactory.CreateClient();
            var apiKey = _config["HuggingFace:ApiKey"];

            var requestBody = new
            {
                model = "zai-org/GLM-5.1",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };
            var jsonPayload = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var modelUrl = _config["HuggingFace:ModelUrl"];
            var response = await client.PostAsync(modelUrl, content);

            var result = await response.Content.ReadAsStringAsync();
            Log.Information($"HuggingFace raw response: {result}"); 

            using var doc = JsonDocument.Parse(result);
            var text = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return Ok(text);
        }

        // GET: api/device/ping
        [HttpGet]
        [Route("ping")]
        public IActionResult Ping() => Ok("pong");

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
                    Role = device.UsedBy.Role,
                    Location = device.UsedBy.Location,
                    Password = "*****"
                }
            };
        }
    }
}