import { User } from "./user.model";

export interface AddDeviceRequest {
    name: string,
    manufacturer: string,
    type: string,
    operatingSystem: string,
    operatingSystemVersion: string,
    processor: string,
    ram: string,
    description: string
}