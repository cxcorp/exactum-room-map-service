# exactum-room-map-service

Service for rendering red circles on the room maps of the University of Helsinki's Kumpula Campus' Exactum building. Useful for showing people which room your meeting is in.

Host behind a caching reverse proxy for best effect, server currently does not cache rendered images (or set cache-control headers).

## Routes

| Route                     | Content-Type     | Description                                                                                                           |
|---------------------------|------------------|-----------------------------------------------------------------------------------------------------------------------|
| `GET /`                   |                  | Redirect to `/rooms`.                                                                                                 |
| `GET /rooms`              | text/html        | Listing of links to images of all rooms in the Exactum floor plan.                                                    |
| `GET /img/v1/rooms/:room` | image/png        | Renders image of the floor plan of the correct floor with a red circle on the specific room (try "A111" for example). |
| `GET /api/v1/rooms`       | application/json | List of all mapped rooms.      

## Environment variables

`HOST` and `PORT` - used to specify hostname and port onto which the server binds.

## License
tba