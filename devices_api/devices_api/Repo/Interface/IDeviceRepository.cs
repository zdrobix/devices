using devices_api.Models.Domain;

namespace devices_api.Repo.Interface
{
    public interface IDeviceRepository
    {
		Task<Device> CreateAsync(Device Device);
        Task<IEnumerable<Device>> GetAllAsync();
        Task<Device?> GetById(int id);
        Task<Device?> UpdateAsync(Device device);
        Task<Device> DeleteAsync(int id);
    }
}
