import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Device } from '../../models/device.model';
import { AddDeviceRequest } from '../../models/add-device-request.model';
import { UpdateDeviceRequest } from '../../models/update-device-request.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/device`;

  constructor(private http: HttpClient) {}

  getAllDevices(): Observable<Device[]> {
  const token = localStorage.getItem('jwt_token');
  return this.http.get<Device[]>(this.apiUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

  getDeviceById(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/${id}`);
  }

  addDevice(device: AddDeviceRequest): Observable<Device> {
    return this.http.post<Device>(this.apiUrl, device);
  }

  updateDevice(id: number, device: UpdateDeviceRequest): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/${id}`, device);
  }

  deleteDevice(id: number): Observable<Device> {
    return this.http.delete<Device>(`${this.apiUrl}/${id}`);
  }

  describeDevice(id: number): Observable<string> {
  return this.http.get(`${this.apiUrl}/describe/${id}`, { responseType: 'text' });
  }
}
