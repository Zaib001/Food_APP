export const ymdLocal = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val.slice(0, 10); // handles ISO or plain
  try {
    return new Date(val).toLocaleDateString('en-CA'); // YYYY-MM-DD in local tz
  } catch {
    return '';
  }
};

export const todayLocal = () => new Date().toLocaleDateString('en-CA');
