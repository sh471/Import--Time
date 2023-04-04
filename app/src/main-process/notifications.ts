import {
  initializeNotifications,
  onNotificationEvent,
  terminateNotifications,
} from 'desktop-notifications'
import { BrowserWindow } from 'electron'
import { findToastActivatorClsid } from '../lib/find-toast-activator-clsid'
import { DesktopAliveEvent } from '../lib/stores/alive-store'
import * as ipcWebContents from './ipc-webcontents'

let windowsToastActivatorClsid: string | undefined = undefined

export function initializeDesktopNotifications() {
  if (__DARWIN__) {
    initializeNotifications({})
    return
  }

  if (windowsToastActivatorClsid !== undefined) {
    return
  }

  windowsToastActivatorClsid = findToastActivatorClsid()

  if (windowsToastActivatorClsid === undefined) {
    log.error(
      'Toast activator CLSID not found in any of the shortucts. Falling back to known CLSIDs.'
    )

    // This is generated by Squirrel.Windows here:
    // https://github.com/Squirrel/Squirrel.Windows/blob/7396fa50ccebf97e28c79ef519c07cb9eee121be/src/Squirrel/UpdateManager.ApplyReleases.cs#L258
    windowsToastActivatorClsid = '{27D44D0C-A542-5B90-BCDB-AC3126048BA2}'
  }

  log.info(`Using toast activator CLSID ${windowsToastActivatorClsid}`)
  initializeNotifications({ toastActivatorClsid: windowsToastActivatorClsid })
}

export function terminateDesktopNotifications() {
  terminateNotifications()
}

export function installNotificationCallback(window: BrowserWindow) {
  onNotificationEvent<DesktopAliveEvent>((event, id, userInfo) => {
    ipcWebContents.send(
      window.webContents,
      'notification-event',
      event,
      id,
      userInfo
    )
  })
}
