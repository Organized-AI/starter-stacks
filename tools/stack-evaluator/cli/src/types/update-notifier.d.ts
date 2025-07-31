declare module 'update-notifier' {
  interface Package {
    name: string;
    version: string;
  }

  interface NotifyOptions {
    defer?: boolean;
    message?: string;
  }

  interface UpdateInfo {
    current: string;
    latest: string;
    type: string;
    name: string;
  }

  interface UpdateNotifier {
    update: UpdateInfo | false;
    notify(options?: NotifyOptions): void;
  }

  function updateNotifier(options: { pkg: Package }): UpdateNotifier;

  export = updateNotifier;
}