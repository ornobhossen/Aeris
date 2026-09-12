// Node's fs.readlink returns EINVAL on OneDrive "Files On-Demand" placeholders
// (reparse points impersonate symlinks but aren't). Next's watchpack and
// recursive-delete swallow ENOENT/ENOTDIR but crash on EINVAL. Treat a
// placeholder as "not a symlink" instead of crashing.
const fs = require("fs");

const swallowEINVAL = (fn) =>
  function (...args) {
    try {
      return fn.apply(this, args);
    } catch (err) {
      if (err && err.code === "EINVAL") return null;
      throw err;
    }
  };

const fsp = fs.promises;
const origReadlink = fsp.readlink.bind(fsp);

fs.readlink = swallowEINVAL(fs.readlink);
fsp.readlink = (p, opts) =>
  origReadlink(p, opts).catch((err) => {
    if (err && err.code === "EINVAL") return null;
    throw err;
  });