const cloneValue = (value) => {
  if (value === undefined || value === null) return value;
  if (Array.isArray(value)) return [...value];
  if (typeof value === 'object') return JSON.parse(JSON.stringify(value));
  return value;
};

class RuntimeStore {
  constructor() {
    this.values = new Map();
    this.expirations = new Map();
    this.lists = new Map();
    this.sortedSets = new Map();
  }

  isExpired(key) {
    const expiresAt = this.expirations.get(key);
    if (!expiresAt) return false;
    if (Date.now() < expiresAt) return false;

    this.values.delete(key);
    this.expirations.delete(key);
    this.lists.delete(key);
    this.sortedSets.delete(key);
    return true;
  }

  setExpiry(key, seconds) {
    if (!seconds) return;
    this.expirations.set(key, Date.now() + Number(seconds) * 1000);
  }

  async get(key) {
    if (this.isExpired(key)) return null;
    return this.values.has(key) ? cloneValue(this.values.get(key)) : null;
  }

  async set(key, value, ...args) {
    if (this.isExpired(key)) {
      this.expirations.delete(key);
    }

    const normalizedArgs = args.map((arg) => (typeof arg === 'string' ? arg.toUpperCase() : arg));
    const nxIndex = normalizedArgs.indexOf('NX');
    const exIndex = normalizedArgs.indexOf('EX');

    if (nxIndex >= 0 && this.values.has(key) && !this.isExpired(key)) {
      return null;
    }

    this.values.set(key, cloneValue(value));

    if (exIndex >= 0) {
      this.setExpiry(key, args[exIndex + 1]);
    } else {
      this.expirations.delete(key);
    }

    return 'OK';
  }

  async del(key) {
    const existed =
      this.values.delete(key) ||
      this.lists.delete(key) ||
      this.sortedSets.delete(key) ||
      this.expirations.delete(key);
    return existed ? 1 : 0;
  }

  async expire(key, seconds) {
    const exists = this.values.has(key) || this.lists.has(key) || this.sortedSets.has(key);
    if (!exists || this.isExpired(key)) return 0;
    this.setExpiry(key, seconds);
    return 1;
  }

  async ping() {
    return 'PONG';
  }

  getList(key) {
    if (this.isExpired(key)) return [];
    if (!this.lists.has(key)) this.lists.set(key, []);
    return this.lists.get(key);
  }

  async lrem(key, _count, value) {
    const list = this.getList(key).filter((item) => item !== value);
    this.lists.set(key, list);
    return list.length;
  }

  async lpush(key, value) {
    const list = this.getList(key);
    list.unshift(value);
    this.lists.set(key, list);
    return list.length;
  }

  async ltrim(key, start, end) {
    const list = this.getList(key).slice(start, end + 1);
    this.lists.set(key, list);
    return 'OK';
  }

  async lrange(key, start, end) {
    const list = this.getList(key);
    return list.slice(start, end + 1);
  }

  getSortedSet(key) {
    if (this.isExpired(key)) return new Map();
    if (!this.sortedSets.has(key)) this.sortedSets.set(key, new Map());
    return this.sortedSets.get(key);
  }

  async zincrby(key, increment, member) {
    const set = this.getSortedSet(key);
    const nextScore = Number(set.get(member) || 0) + Number(increment);
    set.set(member, nextScore);
    this.sortedSets.set(key, set);
    return nextScore;
  }

  async zrevrange(key, start, end) {
    const set = this.getSortedSet(key);
    return [...set.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(start, end + 1)
      .map(([member]) => member);
  }
}

module.exports = new RuntimeStore();
