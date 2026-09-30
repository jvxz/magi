import type { Device, IMyDevice, MatrixClient } from 'matrix-js-sdk'

export function getUserDevices(client: MatrixClient) {
  return getCryptoSafe(client).getUserDeviceInfo([client.getSafeUserId()])
}

export function resolveDeviceName(device: Device | DeviceEntry | IMyDevice) {
  return 'device_id' in device ? (device.display_name ?? device.device_id) : (device.displayName ?? device.deviceId)
}
