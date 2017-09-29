# PickMeUp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.1.

# How it works

1. A user enters site at `/:room`
1. If they are the first in the room, they become the `host` otherwise they are a `guest`
    * only allowed two users per room
1. `host` is to send it's location
    * the assumption is that the `guest` is mostly stationary
1. `guest` calculates the duration from `guest` to `host`
1. `guest` displays durations and sends the duration information to `host` to display on their screen

## Tricks & Features

### Accuracy control
The assumption is that `guest` does not care as much about the eta accuracy at longer distances. They'll only care about distances that are much shorter.

This means we can quickly fetch GPS coordinates without giving it time to provide us an accurate reading

### Predicting
Since predicting time is easy, we can take advantage of it and reduce the amount of data sent


# Setup

## SSL Dev Environment
We'll need to self sign a certificate.

1. Run below at the root of project to generate a `key` and `cert` 
  on [windows...](https://stackoverflow.com/questions/31506158/running-openssl-from-a-bash-script-on-windows-subject-does-not-start-with) (remove the extra slash for `-subj` on other OS)
    ```bash
    openssl req -nodes -new -x509 -keyout server.key -out server.crt -reqexts SAN    -extensions SAN -subj "//CN=localhost"
    ```
    where `XXX` is number of days certificate will be valid for
    
1. Trust the certificate on your machine (google `trust self signed ssl certificate`)
1. Make sure to fully restart your browser.
