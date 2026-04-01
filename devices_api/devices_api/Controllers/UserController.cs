using devices_api.Models.DTO;
using devices_api.Models.Domain;
using devices_api.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using devices_api.Utils;

namespace devices_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly ITokenService tokenService;

        public UserController(IUserRepository userRepository, ITokenService tokenService)
        {
            this.userRepository = userRepository;
            this.tokenService = tokenService;
            Log.Information("UserController initialized");
        }

        // POST : https://localhost:7282/api/user
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDTO userDTO)
        {
            var user = new User
            (
                userDTO.Name,
                userDTO.Name,
                PasswordHasher.Encrypt(userDTO.Password),
                userDTO.Role
            );

            user = await userRepository.CreateAsync(user);
            return Ok(
                new UserDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Password = user.Password,
                    Role = user.Role
                }
            );
        }

        // GET : https://localhost:7282/api/user
        [Authorize]
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            Log.Information($"Searching for a user with id {id}");
            var user = await userRepository.GetById(id);
            if (user == null)
            {
                Log.Information($"Couldn't find user with id {id}");
                return NotFound();
            }
            return Ok(
                new UserDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Password = user.Password,
                    Role = user.Role,
                }
            );
        }

        // POST : https://localhost:7282/api/user
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            Log.Information($"{request.Name} tries to login with password {request.Password}");
            var user = await userRepository.GetByName(request.Name);
            if (user == null)
            {
                Log.Information($"User {request.Name} not found.");
                return NotFound();
            }
            if (PasswordHasher.Encrypt(request.Password) != user.Password)
            {
                Log.Information($"User {request.Name} failed to login by providing an incorrect password.");
                return Unauthorized();
            }

            Log.Information($"User {request.Name} logged in successfully.");

            var token = tokenService.GenerateToken(user);
            var userDto = new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = user.Password,
                Role = user.Role,
            };
            return Ok(new { token, user });
        }

        // GET : https://localhost:7282/api/user
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            Log.Information("Fetching users");
            return await userRepository.GetAllAsync() is IEnumerable<UserDTO> users
                ? Ok(users.Select(user => new UserDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Password = "******",
                    Role = user.Role,
                }))
                : NotFound();
        }

        // DELETE : https://localhost:7282/api/user{id}
        [Authorize]
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteUser([FromRoute] int id)
        {
            var user = await userRepository.DeleteAsync(id);

            return user == null ? NotFound() : Ok(
                new UserDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Password = "******",
                    Role = user.Role,
                }
            );
        }

        // PUT : https://localhost:7282/api/user{id}
        [Authorize]
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateUser([FromRoute] int id, [FromBody] UpdateUserRequestDTO request)
        {
            Log.Information($"Trying to update user with id {id}");
            var user = await userRepository.GetById(id);
            if (user == null)
            {
                Log.Information($"Couldn't find user with id {id}");
                return NotFound();
            }

            user.Name = request.Name;
            user.Name = request.Name;
            user.Password = PasswordHasher.Encrypt(request.Password);
            user.Role = request.Role;

            Log.Information($"Updating user with id {id}");
            user = await userRepository.UpdateAsync(user);

            if (user == null)
            {
                Log.Information($"Couldn't update user with id {id}");
                return NotFound();
            }

            return Ok(
                new UserDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Password = user.Password,
                    Role = user.Role,
                }
            );
        }

        // GET : https://localhost:7282/api/ping
        [HttpGet]
        [Route("marco")]
        public async Task<IActionResult> TestController() =>
            Ok("polo");
    }
}
