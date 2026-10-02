// Site configuration. The only thing that changes between environments.
// The intake endpoint is a public OrionOps route that turns a report into a
// task on the demo board; the agents then pick it up automatically.
window.NEBULA_CONFIG = {
  intakeUrl: 'https://api.dev.orionops.tech/api/public/demo/intake',
  boardUrl: 'https://dev.orionops.tech',
  maxFiles: 3,
  maxFileMb: 5,
};
