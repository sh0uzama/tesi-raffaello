import time
import random
import json
import datetime
from tornado import websocket, web, ioloop
from datetime import timedelta
from random import randint

# paymentTypes = ["cash", "tab", "visa", "mastercard", "bitcoin"]
# namesArray = ['Ben', 'Jarrod', 'Vijay', 'Aziz']


class WebSocketHandler(websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    # on open of this socket
    def open(self):
        print('Connection established.')
        # ioloop to wait for 3 seconds before starting to send data
        ioloop.IOLoop.instance().add_timeout(
            datetime.timedelta(seconds=6), self.send_data)

     # close connection
    def on_close(self):
        print('Connection closed.')

    # Our function to send new (random) data for charts
    def send_data(self):
        print("Sending Data")
        # create a bunch of random data for various dimensions we want
        x1             = random.uniform(0, 0.8)
        x2             = random.uniform(0, 0.8)
        x3             = random.uniform(0, 0.8)
        x4             = random.uniform(0, 1)
        x5             = random.uniform(0, 1)
        x6             = random.uniform(0, 1)
        x7             = random.uniform(0.2, 0.4)
        x8             = random.uniform(0.2, 0.4)
        x9             = random.uniform(0, 0.4)
        x10            = random.uniform(0, 10)
        x11            = random.uniform(0, 40)
        x12            = random.uniform(-16, 6)
        obj_fn_1       = random.uniform(30, 75)
        obj_fn_2       = random.uniform(-50, 400)
        nln_ineq_con_1 = random.uniform(0, 1300)
        
        # create a new data point
        point_data = {
            'x1': x1,
            'x2': x2,
            'x3': x3,
            'x4': x4,
            'x5': x5,
            'x6': x6,
            'x7': x7,
            'x8': x8,
            'x9': x9,
            'x10': x10,
            'x11': x11,
            'x12': x12,
            'obj_fn_1': obj_fn_1,
            'obj_fn_2': obj_fn_2,
            'nln_ineq_con_1': nln_ineq_con_1
            # 'x': time.time()
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
