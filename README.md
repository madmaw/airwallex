# Broccoli & Co.

## Running

To set everything up you'll want to run 
```
npm install
```

To run it you'll want to 
```
npm run vite
```

And go to http://localhost:5173/

## Events
I decided to try to use RXJS observables, instead of callbacks, for this implementation. All events originating from a component are exposed via Observables.

## State management and statefulness
I didn't want to use a state management library (e.g. Redux or MOBX), instead just using React Hooks. I did not want my components to have a bunch of opaque, difficult to test, internal state however. To achieve this I followed a pattern where the state is a prop passed to the component and is managed externally. Combined with the usage of Observables, this meant you could have an external controller (which is also testable) that observes the Observable and updates the state. Most of the components are fairly simple in this application, so only one ended up needing a controller, but I made a little generic implementation of how you'd make a stateless commponent stateful with a controller anyway (`base/stateful_component.tsx`). 

## Testing
I wrote unit tests for most of the classes. I didn't bother with really simple Components, but normally I'd put in a snapshot `it('renders')` for those too. 

You can run the tests with the following command
```
npm run test
```

The `app.tsx` file suffers from being difficult to test in isolation and is a good candidate for integration testing (as opposed to unit testing), which I haven't implemented here. I do wonder if `app.tsx` could be made stateless and made have a controller, following the pattern described earlier, which would make it able to be unit tested.
