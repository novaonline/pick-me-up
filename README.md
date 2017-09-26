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
