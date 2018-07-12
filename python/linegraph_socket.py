import time
import random
import json
import datetime
from tornado import websocket, web, ioloop
from datetime import timedelta
from random import randint

class WebSocketHandler(websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    # on open of this socket
    def open(self):
        print('Connection established.')
        # ioloop to wait for 3 seconds before starting to send data
        ioloop.IOLoop.instance().add_timeout(
            datetime.timedelta(seconds=3), self.send_data)

     # close connection
    def on_close(self):
        print('Connection closed.')

    # Our function to send new (random) data for charts
    def send_data(self):
        print("Sending Data")
        # create a new data point
        point_data = {
            'value': random.randrange(1, 1000),
            'time': time.time()
        }

        print(point_data)

        # write the json object to the socket
        self.write_message(json.dumps(point_data))

        # create new ioloop instance to intermittently publish data
        ioloop.IOLoop.instance().add_timeout(
            datetime.timedelta(seconds=1), self.send_data)


if __name__ == "__main__":
    # create new web app w/ websocket endpoint available at /websocket
    print("Starting websocket server program. Awaiting client requests to open websocket ...")
    application = web.Application([(r'/websocket', WebSocketHandler)])
    application.listen(8001)
    ioloop.IOLoop.instance().start()
