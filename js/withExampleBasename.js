import useBasename from 'history'

// This helper is for setting basename on examples with minimal boilerplate. In
// an actual application, you would build a custom history to set basename.
export default function withExampleBasename(history, dirname) {
  console.log("dirname: " + dirname);
  return useBasename(() => history)({ basename: `/${dirname}` })
}
