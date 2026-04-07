using devices_api.Data;
using devices_api.Models.Domain;
using devices_api.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace devices_api.Repo.Implementation
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly ApplicationDbContext dbContext;

        public DeviceRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Device> CreateAsync(Device Device)
        {
            await dbContext.Devices.AddAsync(Device);
            await dbContext.SaveChangesAsync();
            return Device;
        }

        public Task<Device> DeleteAsync(int id)
        {
            var deleted = dbContext.Devices.FirstOrDefault(d => d.Id == id);
            if (deleted == null)
                throw new ArgumentNullException(nameof(deleted), "Device not found");
            dbContext.Devices.Remove(deleted);
            dbContext.SaveChanges();
            return Task.FromResult(deleted);
        }

        public async Task<IEnumerable<Device>> GetAllAsync() =>
            await dbContext.Devices.ToListAsync();

        public async Task<Device?> GetById(int id)
        {
            var Device = await dbContext.Devices.FindAsync(id);
            return Device;
        }

        public Task<Device?> UpdateAsync(Device Device)
        {
            throw new NotImplementedException();
        }
    }
}
