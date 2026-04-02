import { User } from "./user.model";

export interface UpdateDeviceRequest {
    id: number,
    name: string,
    manufacturer: string,
    type: string,
    operatingSystem: string,
    operatingSystemVersion: string,
    processor: string,
    ram: string,
    description: string,
    usedBy: User | null
}