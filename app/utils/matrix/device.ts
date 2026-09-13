import type { Device, IMyDevice, MatrixClient } from 'matrix-js-sdk'

export function getDeviceVerificationStatus(client: MatrixClient, deviceId: string) {
  const crypto = getCryptoSafe(client)

  return crypto.getDeviceVerificationStatus(client.getSafeUserId(), deviceId)
}

/**
 * @param client matrix client
 * @param userIds optional manual user IDs. defaults to self
 */
export function getUserDevices(client: MatrixClient, userIds?: string[]) {
  const crypto = getCryptoSafe(client)
  return crypto.getUserDeviceInfo(userIds ?? [client.getSafeUserId()])
}

export function resolveDeviceName(device: Device | DeviceEntry | IMyDevice) {
  return 'device_id' in device ? (device.display_name ?? device.device_id) : (device.displayName ?? device.deviceId)
}
