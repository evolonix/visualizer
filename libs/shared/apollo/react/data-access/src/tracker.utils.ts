export type MissingKeys = Record<string, string>;
export type TrackerOptions = { message?: string; key: string; value: string };

export class LogTracker {
  public message = 'keys missing';

  protected registry: Readonly<MissingKeys>[] = [];
  protected key = 'i18n';
  protected value = 'en';

  constructor(
    protected title: string,
    options?: TrackerOptions
  ) {
    if (options) {
      this.key = options.key;
      this.value = options.value;
      this.message = options.message || '';
    }
  }

  protected findEntryBy(key: string): MissingKeys | null {
    return this.registry.reduce((result: MissingKeys | null, it: MissingKeys) => {
      return result || it[this.key] === key ? it : null;
    }, null);
  }

  track(key: string, value: string) {
    if (!this.findEntryBy(key)) {
      this.registry.push({
        [this.key]: key,
        [this.value]: value,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report(passThru?: any): any {
    if (this.registry.length) {
      const msg = `${this.title} ${this.message}:`;
      console.warn(msg, this.registry);
    }
    return passThru;
  }
}
