using devices_api.Models.Domain;

namespace devices_api.Utils
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
