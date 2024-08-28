from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import eventlet
import your_hand_gesture_module  # Import your existing hand gesture recognition module

app = Flask(__name__)
socketio = SocketIO(app, async_mode='eventlet')

# Your existing hand gesture recognition function
def check_next():
    return your_hand_gesture_module.check_next()

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

def background_task():
    while True:
        if check_next():
            socketio.emit('next_page', {'data': 'Next page gesture detected'})
        eventlet.sleep(0.1)  # Adjust the delay as needed

if __name__ == '__main__':
    socketio.start_background_task(background_task)
    socketio.run(app, debug=True)