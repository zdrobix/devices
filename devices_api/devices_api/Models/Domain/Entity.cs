namespace devices_api.Models.Domain
{
    public class Entity<ID>
    {
        public ID Id { get; private set; }
        public Entity<ID> SetId(ID id_)
        {
            this.Id = id_;
            return this;
        }
    }
}
