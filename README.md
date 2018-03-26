# Equoid-UI

[![Build status](https://travis-ci.org/Jiri-Kremser/equoid-ui-prototype.svg?branch=master)](https://travis-ci.org/Jiri-Kremser/equoid-ui-prototype)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source, as a pre-packaged bundle or using the [n tool](https://github.com/tj/n). We require node `8.0.0` and higher.
2. [Yarn][]: We use Yarn to manage Node dependencies.
   Depending on your system, you can install Yarn either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    yarn install

We use yarn scripts and [Webpack][] as our build system.


Run the following commands in three separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

    ./mvnw
    make local-services
    yarn start

[Yarn][] is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `yarn update` and `yarn install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `yarn help update`.

The `yarn run` command will list all of the scripts available to run for this project.

## OAuth 2.0 / OpenID Connect

To log in to your app, you'll need to have [Keycloak](https://keycloak.org) up and running. For local development you can run it with

```bash
docker-compose -f src/main/docker/keycloak.yml up
```

or 

```bash
make local-services
```

The former command starts also the local instance of infinispan.

The security settings in `src/main/resources/application.yml` are configured for this image.

## Building for production

To optimize the equoid application for production, run:

    ./mvnw -Pprod clean package

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

    java -jar target/*.war

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

## OpenShift

You can deploy the application into local OpenShift cloud by invoking

```bash
make oc-run
```

This will kill all the running Docker containers, starts the local OpenShift cloud and creates the resources representing deployment configs, services, routes, secretes, etc. It assumes the `docker` command can be run w/o root privileges and also the `oc` command on the `$PATH`.

For deploying to an external OpenShift cluster run:

```bash
METRICS=1 ./ocp/ocp-apply.sh
```
or if you don't need Prometheus, Alert manager and Grafana combo, simply:
```bash
./ocp/ocp-apply.sh
```

## Testing

To launch your application's tests, run:

    ./mvnw clean test

### Client tests

Unit tests are run by [Karma][] and written with [Jasmine][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

    yarn test

[Node.js]: https://nodejs.org/
[Yarn]: https://yarnpkg.org/
[Webpack]: https://webpack.github.io/
[Angular CLI]: https://cli.angular.io/
[BrowserSync]: http://www.browsersync.io/
[Karma]: http://karma-runner.github.io/
[Jasmine]: http://jasmine.github.io/2.0/introduction.html
[Protractor]: https://angular.github.io/protractor/
[Leaflet]: http://leafletjs.com/
[DefinitelyTyped]: http://definitelytyped.org/
